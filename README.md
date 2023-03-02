# didactic-giggle
discord上でtwitterのユーティリティを利用できるようにするbotです。
今現在、Discord上の特定のチャンネルにtwitterの特定のユーザーのツイートを自動的に流すことに対応しています。
### How to use
config/Serverconfig.jsonを書き換えることで設定ができます。
#### Serverconfig.json
- looptime
    - looptimeはツイートを呼び出す時間です。ミリ秒で表記し、この時間毎にツイートに更新がないか確認します。
    - 警告：あまりにこの時間を早くしすぎるとBOTの利用を制限される可能性があります。変更しないことをおすすめします。

- countlimit
    - サーバーに問い合わせるツイートの最大数です。ツイートが更新されていた場合にどこまで遡るかを指定できます。100以上は推奨しません。

- tokenpath
    - トークンなどの大切な情報を参照するディレクトリです。これにはサーバーのデータ保存先も兼ねています。
#### diconfig.json
- token
    - discordのbotのトークンを入れる必要があります。
#### twconfig.json
- 各項目に応じてTwitterのbotのアクセストークンなどを記入する必要があります

## BOTの権限について
現状では管理者権限を与える必要があります。
discord devloperの設定が適切であることを確認してください。

