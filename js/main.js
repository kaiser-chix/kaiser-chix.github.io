// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 脆弱性対策: 
    // 動的にコンテンツを追加する場合は、innerHTMLではなくtextContentを使用することでXSSを防止します。
    // 例: document.getElementById('target').textContent = userInput;

    // アバター画像をホバーしたときの3Dインタラクティブエフェクト
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg) {
        avatarImg.addEventListener('mousemove', (e) => {
            const rect = avatarImg.getBoundingClientRect();
            // 要素内のマウスの相対座標
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // マウスの位置に応じて傾きを計算
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            avatarImg.style.transform = `scale(1.05) perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        avatarImg.addEventListener('mouseleave', () => {
            avatarImg.style.transform = 'scale(1) perspective(500px) rotateX(0) rotateY(0)';
        });
    }

    // スクロール時のフェードインエフェクト設定 (JS側でも補助的に実装)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 可視領域に入ったら不透明度を1にする
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // 一度表示されたら監視を解除（軽量化）
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.glass-panel').forEach((panel) => {
        // CSS Animationで既に設定しているが、動的に追加された要素などにも対応できるようObserverをアタッチ
        observer.observe(panel);
    });

    // スクロール位置に応じてナビリンクのアクティブ状態を更新
    const sections = [
        document.getElementById('section-top'),
        document.getElementById('section-about'),
        document.getElementById('section-env'),
        document.getElementById('section-connect'),
    ].filter(Boolean); // null除外

    const navLinks = document.querySelectorAll('.dot-nav-item');
    const navHeight = 20; // ドットナビはトップバーではないため固定オフセット

    const updateActiveNav = () => {
        // 現在のスクロール位置に最も近いセクションを探す
        let currentId = sections[0]?.id ?? '';
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= navHeight + 20) {
                currentId = section.id;
            }
        }
        // アクティブクラスの付け替え（textContentを使用してXSSを防止）
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // スクロール・リサイズ時に更新（パフォーマンスのためpassiveオプション設定）
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // 初期表示時にも実行

    // ====================================================
    // タイムゾーン検出: 日本以外のユーザーには現地時刻も表示
    // ブラウザ標準のIntl APIのみ使用（外部サービス不要・XSS対策済み）
    // ====================================================
    const activeTimeEl = document.getElementById('active-time-text');
    if (activeTimeEl) {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // 日本のタイムゾーン以外の場合のみ現地時刻を追加表示
        if (userTz !== 'Asia/Tokyo') {
            // 21:00 JST = 12:00 UTC、03:00+1 JST = 18:00 UTC を基準日で変換
            const baseDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const startUTC = new Date(`${baseDate}T12:00:00Z`); // 21:00 JST
            const endUTC   = new Date(`${baseDate}T18:00:00Z`); // 03:00+1 JST

            // ユーザーのタイムゾーンでフォーマット
            const fmt = new Intl.DateTimeFormat('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: userTz,
            });

            const startLocal = fmt.format(startUTC);
            const endLocal   = fmt.format(endUTC);

            // XSS対策: textContent で安全にDOM更新
            // テキストノードを2行に分けて追加する
            activeTimeEl.textContent = '21:00 - 27:00 (JST)';
            activeTimeEl.appendChild(document.createElement('br'));
            activeTimeEl.appendChild(
                document.createTextNode(`${startLocal} - ${endLocal} (あなたの現地時間)`)
            );
        }
    }
});
