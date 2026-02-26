@echo off
chcp 65001 > nul
echo ====================================================
echo   † 闇の結界（GitHub Pages）更新シーケンス起動 †
echo ====================================================

REM 現在のフォルダがGit管理されていない場合のみ初期化とリモート登録を行う
if not exist ".git" (
    echo [System] ローカルリポジトリ（魔法陣）を生成中...
    git init
    git branch -M main
    git remote add origin https://github.com/kaiser-chix/kaiser-chix.github.io.git
)

echo.
echo [System] 供物（変更されたファイル群）を収集中...
git add .

echo.
echo [System] 詠唱（コミット）中...
REM 日時を変数に入れてコミットメッセージにする
set DATE_STR=%date:~0,10%
set TIME_STR=%time:~0,8%
git commit -m "Dark Update: %DATE_STR% %TIME_STR%"

echo.
echo [System] アーカーシャの記録（GitHub）を書き換えています...
REM -f（強制上書き）オプションにより、既存の kaiser-chix.github.io の内容を全消去して今回のサイトで上書きします
git push -f origin main

echo.
echo ====================================================
echo   † 転送完了。我らが魔導書は更新された… †
echo ====================================================
pause
