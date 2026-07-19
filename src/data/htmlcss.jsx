const htmlcss = {
  id:          'htmlcss',
  lang:        'HTML/CSS',
  color:       '#3bb1e0',
  eyebrow:     'HTML / CSS',
  title:       'Veb Səhifələrin Sehri',
  description: 'HTML ilə səhifələrin skeletini qur, CSS ilə onları gözəlləşdir. Sıfırdan başlayaraq öz veb səhifəni yarat.',
  modules: [
    {
      id: 'module-1', title: 'Dərs 1 — HTML Əsasları',
      status: 'active', lessonCount: 9,
      lessons: [
        { id:1, pill:1, chips:1, title:'Salam, HTML! İlk Teqimiz',         desc:'Brauzerə ilk "Salam Dünya!" mesajını göndəririk.' },
        { id:2, pill:2, chips:1, title:'Böyük Başlıq <h1>',                 desc:'Lövhənin üzərindəki ən böyük yazını necə qoyuruq?' },
        { id:3, pill:3, chips:1, title:'Paraqraflar <p>',                  desc:'Divardakı qeyd kağızı kimi — adi mətnləri yazırıq.' },
        { id:4, pill:4, chips:2, title:'Qalın və Maili Mətn',               desc:'<strong> və <em> ilə vacib sözləri önə çıxarırıq.' },
        { id:5, pill:5, chips:3, title:'Keçidlər: İnternetin Sehrli Portalı <a>',    desc:'Bir səhifədən digərinə keçid necə qurulur?' },
        { id:6, pill:6, chips:3, title:'Sırasız Siyahılar <ul> və <li>',    desc:'Ən çox sevdiyimiz 3 şeyi siyahıya yığaq.' },
        { id:7, pill:7, chips:2, title:'Multimedia: Şəkillər <img>',        desc:'Veb səhifədə piksel şəkil nümayiş etdirək.' },
        { id:8, pill:8, chips:3, title:'Qruplaşdırma <div>',        desc:'Bir neçə elementi qruplaşdırırıq.' },
        { id:9, pill:9, chips:5, title:'Xəzinə Elanı',        desc:'HTML-də öyrəndiyin bütün teqləri (h1, p, strong, em, a, ul, li, img, div) bir yerə yığıb, öz "xəzinə elanı" səhifəni qur' },

      ],
    },
    {
      id: 'module-2', title: 'Dərs 2 — CSS ilə Stil və Dizayn',
      status: 'active', lessonCount: 9,
      lessons: [
        { id:10, pill:1, chips:1, title:'CSS Nədir?',                        desc:'Evi bəzəməyə başlayırıq — style atributu ilə tanış oluruq.' },
        { id:11, pill:2, chips:2, title:'Rənglər <color>',                   desc:'Mətnə istənilən rəngi necə veririk?' },
        { id:12, pill:3, chips:1, title:'Şrift Ölçüsü <font-size>',          desc:'Lövhə yazılarını kiçik və ya nəhəng edirik.' },
        { id:13, pill:4, chips:2, title:'Mərkəzləşdirmə <text-align>',       desc:'Mətni sola, ortaya, ya da sağa yerləşdiririk.' },
        { id:14, pill:5, chips:2, title:'Arxa Fon Rəngi <background-color>', desc:'Mürəkkəbi deyil, kağızı rəngləyirik.' },
        { id:15, pill:6, chips:2, title:'İçəri Boşluq <padding>',            desc:'Qutunun daxilinə yumşaq pambıq döşəyirik.' },
        { id:16, pill:7, chips:2, title:'Çöl Boşluq <margin>',               desc:'Qutular arasında lazımi aralığı buraxırıq.' },
        { id:17, pill:8, chips:1, title:'Haşiyə <border>',                   desc:'Şəkil çərçivəsi kimi — elementə xətt çəkirik.' },
        { id:18, pill:10, chips:5, title:'Otağını Rənglə',        desc:'CSS-də öyrəndiyin bütün xüsusiyyətləri (color, font-size, text-align, background-color, padding, margin, border) bir yerə yığıb, öz otağını dizayn et' },
      ],
    },
  ],
};

export default htmlcss;