document.addEventListener('DOMContentLoaded', () => {
    // スクロール位置に応じてナビリンクのアクティブ状態を更新
    const sections = [
        document.getElementById('section-top'),
        document.getElementById('section-about'),
        document.getElementById('section-lang'),
        document.getElementById('section-env'),
        document.getElementById('section-connect'),
    ].filter(Boolean);

    const navLinks = document.querySelectorAll('.nav-item');
    const navHeight = 20;

    const updateActiveNav = () => {
        let currentId = sections[0]?.id ?? '';
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= navHeight + 20) {
                currentId = section.id;
            }
        }
        // 同じ行に並ぶ項目は、移動先のハッシュを優先して選択する。
        const anchorSection = sections.find(section => '#' + section.id === window.location.hash);
        const currentSection = sections.find(section => section.id === currentId);
        if (anchorSection && currentSection && Math.abs(
            anchorSection.getBoundingClientRect().top - currentSection.getBoundingClientRect().top
        ) < 1) {
            currentId = anchorSection.id;
        }
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'location');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('hashchange', updateActiveNav);
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();

    // 表示用のカウンター。訪問数の送信や集計は行わず、このブラウザ内だけで続ける。
    const counterElement = document.getElementById('visit-counter');
    const counterValue = document.getElementById('counter-value');
    if (counterElement && counterValue) {
        const storageKey = 'kaiserprof-visit-counter';
        const timeout = 5 * 60 * 1000;
        const minimum = 100000;
        const maximum = 999999;
        const now = Date.now();

        const isSpecialNumber = (value) => {
            const digits = String(value);
            const isRound = value % 100 === 0;
            // 全桁のゾロ目に加え、末尾が3桁以上揃う数字も避ける。
            const isRepeated = /(\d)\1{2,}$/.test(digits)
                || digits === digits.slice(0, 2).repeat(3)
                || digits === digits.slice(0, 3).repeat(2);
            const isPalindrome = digits === [...digits].reverse().join('');
            const isSequence = '0123456789'.includes(digits) || '9876543210'.includes(digits);
            return isRound || isRepeated || isPalindrome || isSequence;
        };

        const nextAllowedNumber = (value) => {
            let next = value;
            while (true) {
                if (next > maximum) next = minimum;
                if (!isSpecialNumber(next)) return next;
                next += 1;
            }
        };

        let previous = null;
        try {
            previous = JSON.parse(localStorage.getItem(storageKey));
        } catch {
            // 保存データが壊れている場合や保存が制限されている場合は、新しく始める。
        }

        const canContinue = previous !== null
            && Number.isInteger(previous.value)
            && previous.value >= minimum && previous.value <= maximum
            && Number.isSafeInteger(previous.updatedAt)
            && previous.updatedAt >= 0
            && now >= previous.updatedAt && now - previous.updatedAt < timeout;
        const startingValue = canContinue
            ? previous.value + 1
            : minimum + Math.floor(Math.random() * (maximum - minimum + 1));
        const value = nextAllowedNumber(startingValue);

        try {
            localStorage.setItem(storageKey, JSON.stringify({ value, updatedAt: now }));
        } catch {
            // 保存できなくても、カウンターの表示と他の機能は使えるようにする。
        }

        counterValue.setAttribute('aria-label', String(value));
        for (const digit of String(value)) {
            const span = document.createElement('span');
            span.textContent = digit;
            counterValue.appendChild(span);
        }
        counterElement.hidden = false;
    }

    // ====================================================
    // 多言語（日・英）切り替え処理
    // ====================================================
    const translations = {
        ja: {
            'skip-link': '本文へ移動',
            'header-note': 'インターネットの片隅で、のんびりと。',
            'menu-title': 'もくじ',
            'nav-top': 'トップページ',
            'nav-about': '自己紹介',
            'nav-language': 'ことば',
            'nav-env': 'プレイ環境',
            'nav-connect': 'リンク集',
            'note-title': '管理人より',
            'note-body': 'お喋り、創作、VRChat。\n好きなものを、好きなペースで。',
            'sidebar-caption': '寄り道していってね。',
            'counter-before': 'あなたは',
            'counter-after': '人目のお客様です',
            'welcome-title': 'ようこそ、かいざーのホームページへ。',
            'welcome-subtitle': 'ここは、かいざーのことと、いろんな居場所をまとめたページです。',
            'profile-title': '管理人のプロフィール',
            'about-title': 'もう少し、自己紹介',
            'play-style-title': 'あそびかた',
            'active-time-title': 'よくいる時間',
            'language-title': 'ことば',
            'env-title': 'プレイ環境',
            'connect-title': 'インターネットの居場所',
            'links-intro': 'あちこちにいます。気の合いそうなところで、どうぞよろしく。',
            'main-accounts': 'いつもの居場所',
            'works': 'つくったもの・ご依頼',
            'wishlist': 'ほしいもの',
            'other-accounts': 'そのほかのアカウント',
            'back-top': '↑ ページのいちばん上へ',
            'footer-thanks': 'ここまで見てくれて、ありがとう。',
            'meta-description': 'かいざーのプロフィールサイトです',
            'user-name': 'かいざー',
            'vrchat-id': 'VRChat ID: かいざー',
            'catchphrase': 'まったりとお喋りしたり、写真を取ったり、ワールドを作ったりしています<br>趣味は、お絵かきとか、物書きとか、TRPGとか。<br>今は交通事故に遭って入院中……',
            'play-style-desc': '雑談メイン / 時々謎解きやイベントに参加',
            'tag-pcvr': 'PCVR (入院中により休止中)',
            'tag-quest': 'Quest 3 (入院中により休止中)',
            'tag-fulltrack': 'フルトラ (6点) (入院中により休止中)',
            'tag-lang-ja': '日本語 (ネイティブ)',
            'tag-lang-en': '英語 (読み書きなら。喋れない)',
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
            'link-skeb-memo': 'たまーに開く。',
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
            'skip-link': 'Skip to content',
            'header-note': 'Taking it easy in a little corner of the internet.',
            'menu-title': 'Menu',
            'nav-top': 'Home',
            'nav-about': 'About me',
            'nav-language': 'Languages',
            'nav-env': 'Setup',
            'nav-connect': 'Links',
            'note-title': 'A little note',
            'note-body': 'Chatting, creating, VRChat.\nThe things I love, at my own pace.',
            'sidebar-caption': 'Stay a little while.',
            'counter-before': 'You are visitor',
            'counter-after': 'Thanks for stopping by.',
            'welcome-title': "Welcome to Kaiser's homepage.",
            'welcome-subtitle': 'A little about me, and the places you can find me on the web.',
            'profile-title': 'Meet the webmaster',
            'about-title': 'A little more about me',
            'play-style-title': 'Play style',
            'active-time-title': 'Active hours',
            'language-title': 'Languages',
            'env-title': 'My setup',
            'connect-title': 'My corners of the internet',
            'links-intro': 'You can find me here and there. Come say hello wherever you feel at home.',
            'main-accounts': 'My usual hangouts',
            'works': 'Creations & requests',
            'wishlist': 'Wishlists',
            'other-accounts': 'Other accounts',
            'back-top': '↑ Back to the top',
            'footer-thanks': 'Thanks for stopping by.',
            'meta-description': "Kaiser's profile site.",
            'user-name': 'Kaiser',
            'vrchat-id': 'VRChat ID: かいざー',
            'catchphrase': 'Just here to chill, chat, take pics, and make worlds.<br>Into drawing, writing, and TTRPGs.<br>In the hospital right now after a car accident...',
            'play-style-desc': 'Mostly chatting | Occasionally doing puzzle worlds & events',
            'tag-pcvr': 'PCVR (Suspended due to hospitalization)',
            'tag-quest': 'Quest 3 (Suspended due to hospitalization)',
            'tag-fulltrack': 'Full-body Tracking (6-point) (Suspended due to hospitalization)',
            'tag-lang-ja': 'Japanese (Native)',
            'tag-lang-en': 'English (Read / Write Only)',
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
            'link-skeb-memo': 'Occasionally open for requests.',
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
        if (!Object.hasOwn(translations, lang)) lang = 'ja';
        // 保存が制限されている環境でも、切り替え自体は使えるようにする。
        try {
            localStorage.setItem('pref-lang', lang);
        } catch {
            // 保存できない場合は、このページを開いている間だけ適用する。
        }
        document.documentElement.lang = lang;

        // UIボタンのアクティブ表示切り替え
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
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
                // 翻訳に含まれる改行だけを要素化し、本文はテキストとして挿入する。
                if (key === 'catchphrase') {
                    const lines = translation.split('<br>');
                    el.replaceChildren();
                    lines.forEach((line, index) => {
                        if (index > 0) el.appendChild(document.createElement('br'));
                        el.appendChild(document.createTextNode(line));
                    });
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
        document.querySelector('.avatar-img').alt = lang === 'en'
            ? "Kaiser's avatar illustration" : 'かいざーのアバターイラスト';
        document.querySelector('.site-brand').setAttribute('aria-label', lang === 'en' ? 'KaiserProf home' : 'KaiserProf ホーム');
        document.querySelector('.menu-panel').setAttribute('aria-label', lang === 'en' ? 'Page navigation' : 'ページ内ナビゲーション');
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
    let savedLang = browserLang;
    try {
        savedLang = localStorage.getItem('pref-lang') || browserLang;
    } catch {
        // 保存済みの設定を読めない場合はブラウザの言語を使う。
    }
    setLanguage(savedLang);
});
