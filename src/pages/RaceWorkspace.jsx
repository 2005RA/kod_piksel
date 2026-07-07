// src/pages/RaceWorkspace.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRewards }        from '../context/RewardContext';
import { usePuzzle }         from '../context/PuzzleContext';
import { flyReward }         from '../components/RewardFly';
import HourglassModal        from '../components/HourglassModal';
import ChestModal            from '../components/ChestModal';
import { computeRaceResult } from '../utils/raceScore';
import { supabase }          from '../lib/supabase';
import RaceLeaderboard       from '../components/RaceLeaderboard';
import { useCountdown }      from '../hooks/useCountdown';
import { callEdgeFunction } from '../lib/edgeFunctions';
const HOURGLASS_SECS = 30;
const PULSE_AT       = 15;

// ── BINARY RAIN ──────────────────────────────────────────
function BinaryRain({ active, onDone }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [active, onDone]);
  if (!active) return null;
  const colors = ['#a78bfa','#3A86FF','#4cae50','#f45050','#f4c84a','#00D4AA'];
  return (
    <div className="binary-rain">
      {Array.from({ length: 90 }).map((_, i) => (
        <span key={i} style={{
          left: `${Math.random()*100}vw`, color: colors[Math.floor(Math.random()*colors.length)],
          fontSize: `${14+Math.random()*16}px`,
          animationDuration: `${1.4+Math.random()*1.6}s`,
          animationDelay: `${Math.random()*0.6}s`,
        }}>{Math.random()<0.5?'0':'1'}</span>
      ))}
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="toast show">{msg}</div>;
}

function Timer({ seconds, pulse }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const fmt = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return (
    <div className={`race-timer${pulse ? ' pulse' : ''}${seconds <= 0 ? ' expired' : ''}`}>
      ⏱ {fmt}
    </div>
  );
}

function CharCounter({ code, limit }) {
  const count  = code.replace(/\s/g,'').length;
  const beating = count < limit;
  return (
    <div className={`race-char-counter${beating ? ' beating' : ' over'}`}>
      ⛳ {count} / {limit} simvol {beating ? '✓ Hədəfi keçirsən!' : '✗ Hələ çoxdur'}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────
export default function RaceWorkspace({ race, onBack }) {
  const { rewards, addReward, addChips, checkRaceRewards } = useRewards();
  const { earnPixel } = usePuzzle();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, []);

  const isTimedType = ['timed','speed','bughunt','blind','reverse'].includes(race.type);
  const endsAtISO   = race.endsAt ? new Date(race.endsAt).toISOString() : null;

  const countdownLabel = useCountdown(race.endsAt);
  const isExpired = race.endsAt ? countdownLabel === null : race.status === 'done';

  const [code,            setCode]           = useState(race.starter || '');
  const [timeLeft,        setTimeLeft]       = useState(race.timeLimit ?? 0);
  const [running,         setRunning]        = useState(false);
  const [finished,        setFinished]       = useState(race.status === 'done');
  const [revealed,        setRevealed]       = useState(false);
  const [chestOpen,       setChestOpen]      = useState(false);
  const [showHGModal,     setShowHGModal]    = useState(false);
  const [showChestModal,  setShowChestModal] = useState(false);
  const [usedHourglasses, setUsedHourglasses]= useState(0);
  const [toast,           setToast]          = useState('');
  const [error,           setError]          = useState('');
  const [rain,            setRain]           = useState(false);
  const [checking,        setChecking]       = useState(false);
  const [finishTime,      setFinishTime]     = useState(null);
  const [showRaceBoard,   setShowRaceBoard]  = useState(false);

  const iframeRef = useRef(null);
  const targetRef = useRef(null);
  const timerRef  = useRef(null);
  const rewardRef = useRef(null);
  const startedAt = useRef(null);

  const lines    = code.split('\n').length;
  const lineNums = Array.from({ length: lines }, (_, i) => i + 1).join('\n');

  // Check on load if user already completed this run (by endsAt)
  useEffect(() => {
    if (!userId || !endsAtISO) return;
    supabase
      .from('race_results')
      .select('id')
      .eq('user_id', userId)
      .eq('race_id', race.id)
      .eq('ends_at', endsAtISO)
      .eq('completed', true)
      .maybeSingle()
      .then(({ data }) => { if (data) setFinished(true); });
  }, [userId, endsAtISO]);

  // ── START TIMER ───────────────────────────────────────
  const startTimer = useCallback(() => {
  if (!isTimedType || running || finished || isExpired) return Promise.resolve();
  startedAt.current = Date.now();
  setRunning(true);
  if (endsAtISO) {
    // Local startedAt.current still drives the live countdown UI — only
    // the server's clock counts for the elapsed time that gets scored.
    return callEdgeFunction('start-race', { raceId: race.id, endsAt: endsAtISO })
      .catch((e) => console.error('start-race failed:', e));
  }
  return Promise.resolve();
}, [isTimedType, running, finished, isExpired, endsAtISO, race.id]);

  useEffect(() => {
    if (!running || !isTimedType) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          setFinished(true);
          showToastMsg('⏰ Vaxt bitdi!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, isTimedType]);

  // ── HOURGLASS ─────────────────────────────────────────
  function handleHourglassConfirm() {
    setShowHGModal(false);
    if (rewards.hourglass <= 0) { showToastMsg('Qum saatın yoxdur!'); return; }
    if (usedHourglasses >= (race.maxHourglasses ?? 0)) {
      showToastMsg(`Bu yarışda maksimum ${race.maxHourglasses} qum saatı istifadə edə bilərsən!`);
      return;
    }
    addReward('hourglass', -1); // optimistic UI
    if (userId) {
      // NOTE: supabase.rpc(...) returns a lazy PostgrestFilterBuilder, which
      // implements .then() but NOT .catch() — chaining .catch() directly on
      // it throws a synchronous TypeError before the request is even sent.
      // Use .then(onFulfilled, onRejected) instead, and pass a unique
      // p_task_id since claim_task_reward requires a non-null one.
      supabase.rpc('claim_task_reward', {
        p_delta_hourglasses: -1, p_task_id: `hourglass-use-${race.id}-${crypto.randomUUID()}`, p_source: 'race_hourglass',
      }).then(({ error }) => {
        if (error) console.error('claim_task_reward failed:', error);
      });
    }
    setTimeLeft(prev => prev + HOURGLASS_SECS);
    setUsedHourglasses(n => n + 1);
    showToastMsg(`+${HOURGLASS_SECS} saniyə əlavə edildi! ⏳`);
    flyReward({ emoji: '⏳', targetId: 'pill-hourglass', fromEl: rewardRef.current });
  }

  // ── CHEST ─────────────────────────────────────────────
  function handleChestConfirm() {
    setShowChestModal(false);
    if (!race.chest) return;
    addReward('key', -race.chest.cost);
    if (userId) {
      supabase.rpc('claim_task_reward', {
        p_delta_keys: -race.chest.cost, p_task_id: `chest-open-${race.id}-${crypto.randomUUID()}`, p_source: 'chest',
      }).then(({ error }) => {
        if (error) console.error('claim_task_reward failed:', error);
      });
    }
    setChestOpen(true);
    showToastMsg('Sandıq açıldı! 🗝️');
  }

  // ── RUN ───────────────────────────────────────────────
  function handleRun() {
    if (isExpired) { showToastMsg('Bu yarış bitib — Sıralamaya bax! 🏅'); return; }
    if (!running && isTimedType && !finished) startTimer();
    if (race.type !== 'blind' && iframeRef.current) {
      iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"></head>${code}</html>`;
    }
  }

  // ── CHECK ─────────────────────────────────────────────
  async function handleCheck() {
    if (isExpired) { showToastMsg('Bu yarış bitib — Sıralamaya bax! 🏅'); return; }
    if (!running && isTimedType && !finished) await startTimer();
    if (finished) { showToastMsg('Bu yarışı artıq tamamlamısan! 🏆'); return; }

    if (race.type === 'blind' && iframeRef.current) {
      iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"></head>${code}</html>`;
      setRevealed(true);
    } else if (iframeRef.current) {
      iframeRef.current.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank"></head>${code}</html>`;
    }

    if (!race.validate) { showToastMsg('Bu yarışın yoxlaması hələ hazır deyil 🚧'); return; }
    const ok = race.validate(code);
    if (!ok) {
      setError(race.errorMsg || 'Kodda bir şey düz deyil.');
      return;
    }

    // Client-side check passed, but don't celebrate yet — the server re-runs
    // its own validate() and is the only source of truth. Celebrating here
    // and walking it back on disagreement is what caused rain + "wrong
    // answer" to both show up for the same submission.
    // Local elapsed is only for the toast/finishTime display — it's cosmetic,
    // not the score. The server recomputes elapsed from its own clock.
    const localElapsed = startedAt.current
      ? Math.floor((Date.now() - startedAt.current) / 1000)
      : 0;

    setChecking(true);
    try {
      const result = await callEdgeFunction('submit-race-result', {
        raceId: race.id, endsAt: endsAtISO, code,
      });

      if (!result.ok) {
        setError(race.errorMsg || 'Kodda bir şey düz deyil.');
        return;
      }

      // Server confirmed the pass — safe to celebrate now.
      clearInterval(timerRef.current);
      setRunning(false);
      setFinished(true);
      setRain(true);
      if (race.type === 'speed') setFinishTime(localElapsed);

      if (!result.alreadyCompleted) {
        const taskId = `race-${race.id}-${endsAtISO ?? 'practice'}`;
        const chipsAwarded = addChips(taskId, result.chipsEarned ?? 0, 'race');
        if (chipsAwarded) flyReward({ type: 'chip', fromEl: rewardRef.current });
      }

      setError('');
      showToastMsg(
        race.type === 'speed'
          ? `Əla! ${result.elapsed}  saniyədə bitirdin! 🏆`
          : 'Düzgün! Mükafatlar qazanıldı 🏆'
      );

      // Attempt the race/rank reward claim the instant this run finishes,
      // instead of waiting for the leaderboard panel's own countdown (which
      // only fires if that panel happens to be open) or the next page-load
      // sweep. Safe to call unconditionally — claim_race_reward itself won't
      // pay out until the race's real endsAt has passed.
      if (endsAtISO) checkRaceRewards();
    } catch (e) {
      console.error('submit-race-result failed:', e);
      setError('Nəticə göndərilmədi, yenidən cəhd et.');
    } finally {
      setChecking(false);
    }
  }

  function handleReset() {
    setCode(race.starter || '');
    if (iframeRef.current) iframeRef.current.srcdoc = '';
    setRevealed(false);
    setError('');
  }

  function showToastMsg(msg) { setToast(msg); setTimeout(() => setToast(''), 2400); }

  const canUseHG  = isTimedType && running && rewards.hourglass > 0 && usedHourglasses < (race.maxHourglasses ?? 0);
  const canChest  = !!race.chest && !chestOpen;
  const isPulsing = isTimedType && timeLeft <= PULSE_AT && timeLeft > 0;

  const TYPE_LABELS = { timed:'⏱ Vaxt Yarışı', speed:'⚡ Sürət', golf:'⛳ Golf', bughunt:'🐛 Bug Hunt', blind:'🙈 Kor Kod', reverse:'🔍 Tərsinə' };

  return (
    <div className="lp-wrapper">
      <BinaryRain active={rain} onDone={() => setRain(false)} />
      <Toast msg={toast} />
      <HourglassModal open={showHGModal} onConfirm={handleHourglassConfirm} onCancel={() => setShowHGModal(false)} seconds={HOURGLASS_SECS} />
      <ChestModal     open={showChestModal} chest={race.chest} keys={rewards.key} onConfirm={handleChestConfirm} onCancel={() => setShowChestModal(false)} />

      <nav className="lp-nav">
        <button className="btn-back" onClick={onBack}>◀ GERİ</button>
        <span className="tag-pill">{TYPE_LABELS[race.type] ?? race.type}</span>
        <span className="lesson-name">{race.title}</span>

        <button
          className={`race-hg-btn${isExpired ? ' race-hg-btn--highlight' : ''}`}
          onClick={() => setShowRaceBoard(s => !s)}
          title="Bu yarışın sıralamasına bax"
        >
          🏅 Sıralama
        </button>

        {isExpired ? (
          <div className="race-timer expired">⏰ Bitdi</div>
        ) : isTimedType && (
          <Timer seconds={timeLeft} pulse={isPulsing} />
        )}

        {race.type === 'golf' && (
          <CharCounter code={code} limit={race.charLimit ?? 999} />
        )}

        {isTimedType && !isExpired && (
          <button
            className={`race-hg-btn${canUseHG ? '' : ' disabled'}`}
            onClick={() => canUseHG && setShowHGModal(true)}
            title={`Qum saatı istifadə et (+${HOURGLASS_SECS}s) — ${usedHourglasses}/${race.maxHourglasses ?? 0} istifadə edildi`}
            disabled={!canUseHG}
          >
            ⏳ ×{rewards.hourglass}
          </button>
        )}

        {canChest && !isExpired && (
          <button className="race-chest-btn" onClick={() => setShowChestModal(true)}>
            📦 İpucu ({race.chest?.cost}🗝️)
          </button>
        )}
      </nav>

      {showRaceBoard && <RaceLeaderboard race={race} currentUserId={userId} refetchOnMount={finished} />}

      {isTimedType && !running && !finished && !isExpired && timeLeft === (race.timeLimit ?? 0) && (
        <div className="race-start-overlay">
          <div className="race-start-card">
            <div className="race-start-icon">{race.icon}</div>
            <div className="race-start-title">{race.title}</div>
            <div className="race-start-sub">{TYPE_LABELS[race.type]} · {Math.floor((race.timeLimit??0)/60)} dəq {(race.timeLimit??0)%60 > 0 ? `${(race.timeLimit??0)%60} san` : ''}</div>
            {race.maxHourglasses > 0 && (
              <div className="race-start-hg">⏳ Bu yarışda max {race.maxHourglasses} qum saatı istifadə edə bilərsən</div>
            )}
            <button className="btn-primary race-start-btn" onClick={startTimer}>
              Başla →
            </button>
          </div>
        </div>
      )}

      <div className={`workspace${race.type === 'reverse' ? ' workspace--reverse' : ''}`}>
        <div className="left-col">
          <section className="panel">
            <div className="panel-header">
              <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
              <span className="panel-title">📋 TAPŞIRIQ</span>
              <span className="spacer"/>
            </div>
            <div className="panel-body top-left-body">
              {race.type === 'bughunt' && (
                <div className="bughunt-banner">🐛 Kodda səhvlər var — tap və düzəlt!</div>
              )}
              <div className="task-box">
                <div className="task-text" dangerouslySetInnerHTML={{ __html: race.taskHtml || '' }} />
              </div>
              {chestOpen && race.chest && (
                <div className="chest-revealed">
                  <div className="chest-revealed-label">💡 İpucu</div>
                  <div className="chest-hint-text">{race.chest.hint}</div>
                  {race.chest.code && <pre className="chest-hint-code">{race.chest.code}</pre>}
                </div>
              )}
              {race.type === 'speed' && finished && finishTime && (
                <div className="speed-result">⚡ Bitiş vaxtın: <strong>{finishTime} saniyə</strong></div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <span className="dots"><span className="dot-g"/></span>
              <span className="panel-title">KOD ({race.type === 'bughunt' ? 'DÜZƏLT' : 'YAZ'})</span>
              <span className="spacer"/>
              <button className="link-btn" onClick={() => navigator.clipboard.writeText(code).then(()=>showToastMsg('Kopyalandı!'))}>NÜSXƏLƏ</button>
            </div>
            <div className="editor-wrap">
              <div className="line-numbers">{lineNums}</div>
              <textarea
                className="code-input"
                value={code}
                onChange={e => { if (isExpired || finished) return; setCode(e.target.value); if (!running && isTimedType && !finished) startTimer(); }}
                spellCheck={false}
                disabled={finished || isExpired}
              />
            </div>
            <div className="editor-actions">
              <button className="btn btn-reset" onClick={handleReset} disabled={finished || isExpired}>↺ SIFIRLA</button>
              <div className="btn-group">
                {race.type !== 'blind' && (
                  <button className="btn btn-run" onClick={handleRun} disabled={finished || isExpired}>RUN</button>
                )}
                <button className="btn btn-check" onClick={handleCheck} disabled={finished || isExpired || checking}>
                  {checking ? 'YOXLANILIR...' : (race.type === 'blind' ? '🙈 TƏQDIM ET' : 'CAVABIMI YOXLA')}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="right-col">
          {race.type === 'reverse' && (
            <section className="panel">
              <div className="panel-header">
                <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
                <span className="panel-title">🎯 HƏDƏF NƏTİCƏ</span>
              </div>
              <div className="preview-area">
<iframe ref={targetRef} title="Hədəf" srcDoc={race.targetHtml || ''}
  sandbox="allow-scripts allow-popups" />                <span className="watermark">HƏDƏF</span>
              </div>
            </section>
          )}

          <section className="panel" style={{ flex: race.type === 'reverse' ? '1' : undefined }}>
            <div className="panel-header">
              <div className="dots"><span className="dot-r"/><span className="dot-y"/><span className="dot-g"/></div>
              <span className="panel-title">
                {race.type === 'blind' && !revealed ? '🙈 CANLI MONİTOR (GİZLİ)' : 'CANLI MONİTOR'}
              </span>
            </div>
            <div className="preview-area" style={{ position:'relative' }}>
              {race.type === 'blind' && !revealed && (
                <div className="blind-overlay">
                  <span>🙈</span>
                  <span>Təqdim edənə kimi gizlidir</span>
                </div>
              )}
<iframe ref={iframeRef} title="Önizləmə" style={{ opacity: race.type==='blind' && !revealed ? 0 : 1 }}
  sandbox="allow-scripts allow-popups" />
                <span className="watermark">PİKSEL BRAUZER V1</span>
            </div>
          </section>

          {error && (
            <section className="panel error-panel">
              <div className="panel-header">
                <div className="dots"><span className="dot-r"/><span className="dot-r"/><span className="dot-r"/></div>
                <span className="panel-title">⚠ XƏTA</span>
              </div>
              <div className="error-body">✗ {error}</div>
            </section>
          )}

          {finished && (
            <section className="panel" style={{ border:'2px solid rgba(0,212,170,.4)' }}>
              <div className="panel-body" style={{ padding:18, textAlign:'center' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:8 }}>🏆</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, color:'var(--teal)', marginBottom:4 }}>
                  Tamamlandı!
                </div>
                {race.type === 'speed' && finishTime && (
                  <div style={{ fontSize:'.78rem', color:'var(--muted)' }}>Vaxtın: {finishTime} saniyə</div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}