// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 脆弱性対策: 
    // 動的にコンテンツを追加する場合は、innerHTMLではなくtextContentを使用することでXSSを防止します。
    // ※静的な翻訳データなど安全が保証されている値のみinnerHTMLを使用します。

    // アバター画像をホバーしたときの3Dインタラクティブエフェクト
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg) {
        avatarImg.addEventListener('mousemove', (e) => {
            const rect = avatarImg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            avatarImg.style.transform = `scale(1.05) perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        avatarImg.addEventListener('mouseleave', () => {
            avatarImg.style.transform = 'scale(1) perspective(500px) rotateX(0) rotateY(0)';
        });
    }

    // スクロール時のフェードインエフェクト設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.glass-panel').forEach((panel) => {
        observer.observe(panel);
    });

    // スクロール位置に応じてナビリンクのアクティブ状態を更新
    const sections = [
        document.getElementById('section-top'),
        document.getElementById('section-about'),
        document.getElementById('section-env'),
        document.getElementById('section-connect'),
    ].filter(Boolean);

    const navLinks = document.querySelectorAll('.dot-nav-item');
    const navHeight = 20;

    const updateActiveNav = () => {
        let currentId = sections[0]?.id ?? '';
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= navHeight + 20) {
                currentId = section.id;
            }
        }
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ====================================================
    // 多言語（日・英）切り替え処理
    // ====================================================
    const translations = {
        ja: {
            'meta-description': 'かいざーのプロフィールサイトです',
            'user-name': 'かいざー',
            'vrchat-id': 'VRChat ID: かいざー',
            'catchphrase': 'まったりとお喋りしたり、写真を取ったり、ワールドを作ったりしています<br>趣味は、お絵かきとか、物書きとか、TRPGとか。<br>今は交通事故に遭って入院中……',
            'play-style-desc': '雑談メイン / 時々謎解きやイベントに参加',
            'tag-pcvr': 'PCVR',
            'tag-quest': 'Quest 3 (入院中により休止中)',
            'tag-fulltrack': 'フルトラ (6点) (入院中により休止中)',
            'link-niri-name': 'にりらみすきー部 (Misskey)',
            'link-buicha-name': 'ぶいちゃ.social (Misskey)',
            'link-neko-name': 'ねころびばーちゃる (Misskey)',
            'link-x-name': 'X (旧Twitter)',
            'link-vrchat-memo': 'フレンド申請はわかる人なら多分通すよ。',
            'link-amazon-id': 'かいざーの姫プリスト',
            'link-amazon-memo': '編集権限は割と気軽に配ってるので欲しい人は教えて下さい。',
            'link-booth-id': 'ほしいもの',
            'link-booth-memo': 'Boothの欲しいものリスト。いろいろ放り込んでる。無いものでも歓迎。',
            'link-fanbox-memo': '小説やイラストの投稿、支援など。雑多に色々投げるところ。',
            'link-x-memo': '最近はリプとかしかみてないかも。',
            'link-niri-memo': 'メイン。Fediverseの人なら繋がれるし、一番見てる。',
            'link-buicha-memo': 'サブ。ここの人と話すときとは割と使ってるかも。',
            'link-neko-memo': 'サブ。そんなには使ってないかも。',
            'link-io-memo': 'ID確保しただけ。ほとんど見てない。',
            'link-mixi-memo': 'ID確保しただけ。ほとんど見てない。',
            'link-bsky-memo': 'ID確保しただけ。ほとんど見てない。',
            'link-fedi-memo': 'ID確保しただけ。ほとんど見てない。',
            'footer-text': '© 2026 かいざー. All Rights Reserved.'
        },
        en: {
            'meta-description': "Kaiser's profile site.",
            'user-name': 'Kaiser',
            'vrchat-id': 'VRChat ID: かいざー',
            'catchphrase': 'Just here to chill, chat, take pics, and make worlds.<br>Into drawing, writing, and TTRPGs.<br>In the hospital right now after a car accident...',
            'play-style-desc': 'Mostly chatting | Occasionally doing puzzle worlds & events',
            'tag-pcvr': 'PCVR',
            'tag-quest': 'Quest 3 (Suspended due to hospitalization)',
            'tag-fulltrack': 'Full-body Tracking (6-point) (Suspended due to hospitalization)',
            'link-niri-name': 'Nirila Misskey Bu (Misskey)',
            'link-buicha-name': 'buicha.social (Misskey)',
            'link-neko-name': 'Nekolobby Virtual (Misskey)',
            'link-x-name': 'X (formerly Twitter)',
            'link-vrchat-memo': "Friend requests welcome if we've met/talked before!",
            'link-amazon-id': "Kaiser's Wishlist",
            'link-amazon-memo': "I'm super chill about giving wishlist edit access, so feel free to ask for it.",
            'link-booth-id': 'Wishlist',
            'link-booth-memo': 'My Booth wishlist. I just throw random things in it, but gifts off the list are always welcome too.',
            'link-fanbox-memo': 'A random collection of my novels and artwork, plus a place to send support.',
            'link-x-memo': 'Lately I mostly just check replies.',
            'link-niri-memo': 'My main account. I check this one the most, and anyone on the Fediverse can connect with me here.',
            'link-buicha-memo': 'Sub account. Sometimes used for chatting with people here.',
            'link-neko-memo': 'Sub account. Not used very often.',
            'link-io-memo': 'Just holding the handle. Rarely active here.',
            'link-mixi-memo': 'Just holding the handle. Rarely active here.',
            'link-bsky-memo': 'Just holding the handle. Rarely active here.',
            'link-fedi-memo': 'Just holding the handle. Rarely active here.',
            'footer-text': '© 2026 Kaiser. All Rights Reserved.'
        }
    };

    // アクティブ時間（現地時間）の多言語連動更新
    const updateActiveTime = (lang) => {
        const activeTimeEl = document.getElementById('active-time-text');
        if (!activeTimeEl) return;

        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (userTz !== 'Asia/Tokyo') {
            const baseDate = new Date().toISOString().slice(0, 10);
            const startUTC = new Date(`${baseDate}T12:00:00Z`);
            const endUTC   = new Date(`${baseDate}T18:00:00Z`);

            const fmt = new Intl.DateTimeFormat('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: userTz,
            });

            const startLocal = fmt.format(startUTC);
            const endLocal   = fmt.format(endUTC);

            const suffix = lang === 'en' ? 'Your local time' : 'あなたの現地時間';

            activeTimeEl.textContent = '21:00 - 27:00 (JST)';
            activeTimeEl.appendChild(document.createElement('br'));
            activeTimeEl.appendChild(
                document.createTextNode(`${startLocal} - ${endLocal} (${suffix})`)
            );
        } else {
            activeTimeEl.textContent = '21:00 - 27:00 (JST)';
        }
    };

    // 言語の適用
    const setLanguage = (lang) => {
        localStorage.setItem('pref-lang', lang);
        document.documentElement.lang = lang;

        // UIボタンのアクティブ表示切り替え
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // DOM要素のテキスト書き換え
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translations[lang]?.[key];
            if (translation) {
                // 改行タグを含む特定の要素（catchphrase）のみinnerHTMLを使用し、他はXSS対策としてtextContentを使用
                if (key === 'catchphrase') {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // メタタグ（SEO / OGP用）の動的更新
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', translations[lang]['meta-description']);
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', translations[lang]['meta-description']);
        
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', translations[lang]['meta-description']);

        // 現地時間表示の更新
        updateActiveTime(lang);
    };

    // スイッチボタンのイベント設定
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 初期化（ストレージ優先、無ければブラウザ言語、デフォルトはja）
    const browserLang = navigator.language.startsWith('en') ? 'en' : 'ja';
    const savedLang = localStorage.getItem('pref-lang') || browserLang;
    setLanguage(savedLang);
});
