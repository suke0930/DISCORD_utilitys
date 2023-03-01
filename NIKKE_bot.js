//もろもろ初期化
//いろいろ定義
const Twit = require('twitter');//twitterのライブラリ
const { Client, GatewayIntentBits, Partials } = require('discord.js'); //discord.js から読み込む
const fs = require('fs');//FILE読み書きするやつ
const cloneObject = require('./lib/lib.js');//ライブラリのインポート
// const { error } = require('console');
const twconfig = JSON.parse(fs.readFileSync("./config/twconfig.json", 'utf8').toString());//APIKEY読み出し 前回やったね☆ 
const dicondigtext = JSON.parse(fs.readFileSync("./config/diconfig.json", 'utf8').toString());//CONFIG読み出し 前回やったね☆
const ServerDATA = JSON.parse(fs.readFileSync("./ServerDATA.json", 'utf8').toString());//チャンネルID呼び出し
const Serverconifg = JSON.parse(fs.readFileSync("./config/Serverconfig.json", 'utf8').toString());//チャンネルID呼び出し

const T = new Twit(twconfig);//Tがtwitterの呼び出しライブラリ

// console.log(cloneObject)
// const serverID = {//サーバーIDのデーターベース置き場
//     server1: 0,
//     server2: 0
// };
// const channelID = {//チャンネルIDのデーターベース置き場
//     server1: 0,
//     server2: 0
// };
// const moreDATA = {//そのた
//     servercounts: 0,
//     nikke1: 0
// };
//構造メモ
// const ServerDATA = {
//     serverID1: {
//         serverID: 0,
//         channelID: 0,
//         NIKKEFLAG: 0
//     },
//     serverID2: {
//         serverID: 0,
//         channelID: 0,
//         NIKKEFLAG: 0
//     },
//      prop: {
//      (serverID): {
//         CID: 
//         USER:
//          }
//      }
// }
// こんな感じで続いていく
const DIclient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ],
});
//DISCORDログイン
async function ConectDiscord(dicondigtext) {//トークンで接続
    await DIclient.login(dicondigtext.token);
};
DIclient.once('ready', () => { console.log(`${DIclient.user.tag} Ready`); });//接続に完了したことを表示する
ConectDiscord(dicondigtext)

//function一覧
//ベースライブラリ(モジュール化してもいいくらい基本的な関数)
function savejson(saveDATA, Jsonname, log_flag) {//jsonセーブするためだけにこんなのいちいち書いてられないよね
    const jsonData = JSON.stringify(saveDATA);
    fs.writeFile(Jsonname, jsonData, (err) => {
        if (err) {
            if (log_flag === true) { console.error(err) };
            return;
        }
        if (log_flag === true) { console.log(Jsonname + ' saved successfully'); };
    });
}


///===================<Twwiterへの要求処理のテンプレ>=========================================
/**
 * 指定されたユーザーの最新ツイートを取得する。
 * @param {string} userID ユーザー名
 * @param {number} count 問い合わせる件数
 */

async function get_user_tweet(userID, count) {


    const params = { screen_name: userID, count: count };
    const data = await new Promise((resolve, reject) => T.get('statuses/user_timeline', params, (err, data) => {
        if (!err) {
            resolve(data);
        } else {
            reject(err);
        }
    }));
    return data;
};
///==================</Twwiterへの要求処理のテンプレ>=========================================
//Discord関連
function temp_ID() {

    return {
        "channelID": 0
    };
};


function any_notification(ServerDATA, DATANAME, TEXT) {//プロパティに登録してあるチャンネルに情報を一斉送信する
    /**
     * @param {string} DATANAME any_notificationで使われる値。基本的に中身はpropsと同じ意味を持つ。とっとと修正しろ！！！！！！！！！！！！！！！ 
     */
    //呼び出し方:any_notification(ServerDATA(これで固定), DATANAME(送信したいプロパティ), TEXT(送信したい文字))
    // const DATANAMEprop = Object.keys(ServerDATA[DATANAME]);
    try {

        for (const DATANAMEprop of ServerDATA[DATANAME]) {//discordのチャンネルに通知を送るためのループ
            if (DATANAMEprop !== "USER") {
                if ((DATANAMEprop !== "plat")) {
                    if (DATANAMEprop !== "last") {
                        //サーバ一覧のIDを引っ張り出す
                        //object.keyに対する配列番号によるデーターの取得
                        //ServerDATA[NIKKE_ID_LIST]==Server.DATAの、"SID"+ServerDATA.[DATENAME]に対するkeyの配列番号を用いたキーの取得
                        console.log(DATANAMEprop)
                        console.log(ServerDATA[DATANAME][DATANAMEprop])
                        sendmessege(DATANAMEprop, ServerDATA[DATANAME][DATANAMEprop].CID, TEXT)
                    };
                };
            };
        };
    } catch (error) {
        any_notification(ServerDATA, "emergancy", "DISCORDのサーバにメッセージが送れないのだ！(CV.ずんだもん)")
        any_notification(ServerDATA, "emergancy", "エラーの名前なのだ！：" + error.name)
        any_notification(ServerDATA, "emergancy", "エラーの内容なのだ！：" + error.message)
        any_notification(ServerDATA, "emergancy", "代入されたpropなのだ！" + DATANAME)
    }
};

function sendmessege(SID, CID, messege) {//指定されたチャンネルにメッセージを送る
    DIclient.guilds.cache.get(SID)
    DIclient.channels.cache.get(CID)
        .send(messege);
};

function save_server_data(ServerDATA) {//チャンネルに関する情報を保存する
    savejson(ServerDATA, "ServerDATA.json", 1)

};
function addPROP(ServerDATA, PROPNAME, platname, USERNAME) {//PROPに詳細が追加されたりした場合に追加などをする
    if (!ServerDATA[PROPNAME]) { ServerDATA[PROPNAME] = {} };
    ServerDATA[PROPNAME].plat = platname;
    ServerDATA[PROPNAME].USER = USERNAME;
}
function find_serverID(ServerDATA, message, moreFLAG) {//呼び出し元のサーバーIDを探し、なければ作成。すべてオブジェクト
    const ID_ = "SID" + message.guild.id;
    if (ServerDATA[ID_]) { //ServerIDの何番が要求元のIDか判断する
        ServerDATA[ID_].channelID = message.channel.id; //存在していればチャンネルを上書きする
    } else { //していなければ作成する
        console.log("サーバーIDが存在しません。作成します。");
        ServerDATA["SID" + message.guild.id] = temp_ID()//テンプレートをコピーし生成
        ServerDATA["SID" + message.guild.id].channelID = message.channel.id;//チャンネルIDをを書き込む
        ServerDATA["SID" + message.guild.id].serverID = message.guild.id;//鯖IDをを書き込む
        console.log("サーバーID:ServerDATA." + ServerDATA["SID" + message.guild.id]);
        const length = Object.keys(ServerDATA)
        console.log("現在の鯖カウント:" + length.length);
    }
    if (!ServerDATA[moreFLAG]) {
        ServerDATA[moreFLAG] = {}
    };
    ServerDATA[moreFLAG][message.guild.id] = { CID: {} }
    ServerDATA[moreFLAG][message.guild.id].CID = message.channel.id
}

/**
 * //twitterから情報を取得しdiscordのサー-バーに流す。thenまで内蔵しているためpromiceを得る必要はない...?
 * @param {string} data_detail.get_data_type ツイッターに問い合わせるRequestの種類。これがすべての始まりになり得る。
 * @param {string} data_detail.request_content ツイッターのIDや検索ワードなどのデータ
 * @param {string} data_detail.prop プロパティの名前
 * @param {string} data_detail.URL  witterに問い合わせるリンク。
 * @param {string} data_detail.count ツイートをいくつまで遡って取得するか
 * @param {string} data_detail.limit_get 取得できていないツイートをいくつまで遡って取得するか 0の場合は一件しか取得しない
 * @param {string} data_detail.latest_ID 最後に入力したtweetのIDを覚えておく
 *   ////[実装済みリスト]
 *   //USER = 
 *   //
 *   ////[/実装済みリスト]
 *   //↓ユーザに繋げる場合の例
 *   //"https://twitter.com/" + tweet[0].user.id + "/status/" + tweet[0].id_str // twitterへの問い合わせのコード
 *   //↑例
 *   // function any_notification(ServerDATA, DATANAME, TEXT) {//プロパティに登録してあるチャンネルに情報を一斉送信する
 *   //呼び出し方:any_notification(ServerDATA(これで固定), DATANAME(送信したいプロパティ), TEXT(送信したい文字))
 * @param {Object} ServerDATA すべてのデータが入ったオブジェクト
 * @param {*} data_detail ここでのみ使うオブジェクト形式のデータ
 */
async function twitter_send(ServerDATA, data_detail) {//twitterから情報を取得しdiscordのサーバーに流す。thenまで内蔵しているためpromiceを得る必要はない...?
    //オブジェクトとして転送するのがベストではないかと思われ
    //↓ユーザに繋げる場合の例
    //"https://twitter.com/" + tweet[0].user.id + "/status/" + tweet[0].id_str // twitterへの問い合わせのコード
    //↑例
    //呼び出し方:any_notification(ServerDATA(これで固定), DATANAME(送信したいプロパティ), TEXT(送信したい文字))

    if (data_detail.get_data_type === "USER") {//ユーザーのデータを要求された場合
        if (!data_detail.limit_get === 0) {//遡る件数を指定された場合遡る
            let skipflag = false
            let tweet = {}
            let errorflag = 0
            let zero_is_undifind = 0
            /**
             * @param {string} skipflag ツイートに更新がなかった際にスキップする判定フラグ
             * @param {object} tweet ツイートの取得データー。。
             * @param {string} errorflag 主にgettweet()関数でエラーを吐いた場合にスローするための分岐フラグ
             * @param {string} zero_is_undifind tweet[0]にデーターが挿入されなかった場合の分岐フラグ
             */


            for (let I = 0; I < data_detail.limit_get; I++) {//リミットにぶち当たるまで問い合わせを続ける
                try {
                    tweet = await get_user_tweet(ServerDATA[data_detail.prop].USER, (I + 1))
                    if (tweet[0] === undefined) {//エラー分岐
                        zero_is_undifind = 1
                        throw error;
                    }
                    if (ServerDATA[data_detail.prop].last === tweet[0].id) {
                        skipflag = true
                        break;
                    }
                } catch (error) {//何らかの理由により取得できなかった場合
                    console.log("Error!111");
                    errorflag = 1
                    any_notification(ServerDATA, "emergancy", "なにかbotに障害が出ています！get_user_tweetのpromiseがエラーを吐いたようです！")//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
                    if (zero_is_undifind === 1) {
                        any_notification(ServerDATA, "emergancy", "どうやらtweet[0]すら消滅したようです...　参照されたpropsは" + prop + "です。")//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）}
                    }

                    if (errorflag !== 1 && zero_is_undifind !== 1) {

                        //tweet[0]すらもundifindだとエラー落ちする。
                        //将来的に根本的にundifindが代入されないようにエラー分岐を作るべき。
                        //issueに書いとく。
                        //実装しました
                        try {
                            if (data_detail.latest_ID === tweet[I].id) { break; }
                        } catch (error) {
                            any_notification(ServerDATA, "emergancy", "致命的なエラーが起きました。tweet[0]がundifindではないのにエラーが出ています。")//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
                            any_notification(ServerDATA, "emergancy", "エラーの名前:" + error.name)
                            any_notification(ServerDATA, "emergancy", "エラーの内容:" + error.message)
                        }
                    };
                };

            };


            try {
                if (!skipflag) {//スキップフラグがtrueなら実行しない
                    //ここからは入手したデーターの変換処理 & 古いものから順に流すためにいろいろする    
                    // for (I = 0; I < DATANAMEprop.length; I++) {
                    //     //サーバ一覧のIDを引っ張り出す
                    //     const NIKKE_ID_LIST = "SID" + DATANAMEprop//↑のobject.keyに対する配列番号によるデーターの取得
                    //     //ServerDATA[NIKKE_ID_LIST]==Server.DATAの、"SID"+ServerDATA.[DATENAME]に対するkeyの配列番号を用いたキーの取得
                    //     sendmessege(ServerDATA[NIKKE_ID_LIST].serverID, ServerDATA[NIKKE_ID_LIST].channelID, TEXT)
                    // }


                    for (const tweetone of tweet) {//
                        /**
                         * @param {object} tweetone for文で取り出すことを前提としたtweetの要素。
                         */
                        const text = "https://twitter.com/" + tweetone.user.id + "/status/" + tweetone.id_str//アクセスできる形式に変換
                        // any_notification(ServerDATA, data_detail.prop, text)//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト
                        if (ServerDATA[data_detail.prop].last === tweetone.id) {
                            skipflag = true
                            break;
                        }

                        //   any_notification(ServerDATA, data_detail.prop, "[プレビュー表示用]");//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）


                        any_notification(ServerDATA, data_detail.prop, text)//ここでDISCORDのチャンネルに通知を流す
                        //  any_notification(ServerDATA, "emergancy", "なにかbotに障害が出ています！get_user_tweetのpromiseがエラーを吐いたようです！");//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
                        //</ここからは入手したデーターの変換処理 & 古いものから順に流すためにいろいろする>
                    };

                }
                if (errorflag !== 1) {
                    ServerDATA[data_detail.prop].last = tweet[0].id;//最後のツイートのIDを保持する

                }
            } catch {
                console.log("重大なエラー！")
                any_notification(ServerDATA, "emergancy", "なにかbotに障害が出ています! 参照したprop:" + data_detail.prop)
            }
            //     if (skipflag === 1) { any_notification(ServerDATA, data_detail.prop, "更新ないで？") }

        } else {//一件しか取得しない場合
            // try {

            // const tweet = await new Promise(resolve => setTimeout((data) => { resolve(data) }, 1000));
            const tweet = await get_user_tweet(ServerDATA[data_detail.prop].USER, 1)
            const text = "https://twitter.com/" + tweet[0].user.id + "/status/" + tweet[0].id_str//アクセスできる形式に変換
            any_notification(ServerDATA, data_detail.prop, text)//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
            // } catch (error) {//何らかの理由により取得できなかった場合
            //     console.log("Error!222");
            //     //緊急事態宣言をしなきゃ...
            //     // emergancy = 緊急事態宣言のタグ
            //     any_notification(ServerDATA, "emergancy", "なにかbotに障害が出ています!!!!!!!!！get_user_tweetのpromiseがエラーを吐いたようです！")//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
            // }

        }
    };

}


DIclient.on('messageCreate', async message => {//DISCORDのメッセージに関する処理いろいろ
    //デバッグコマンド一覧
    if (message.content === '!debug_id') {//ID表示用のデバッグ
        // setchannel(messege)//setchannelする（）
        console.log(message.channel)//でばっぐ
        console.log(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
        message.channel.send(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
        //     // message.channel.send('hi!');
        // };
        // if (message.content === 'ICEは') {//ID表示用のデバッグ
        //     // setchannel(messege)//setchannelする（）
        //     console.log(message.channel)//でばっぐ
        //     console.log(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
        //     message.channel.send(`天才！`);

        //     // message.channel.send('hi!');
    };


    if (message.content === '!debug_send') {//チャンネルにテストメッセージを送る
        message.channel.send(`予約されたチャンネルに情報を送信します`);
        any_notification(ServerDATA, "DEBUG", "TESTING NOW");
    };
    //形式 !debugset プロパティ名!サービス名@ユーザー名
    if (message.content === '!debug_obj') {//チャンネルを記録する
        // setchannel(messege)//setchannelする（）
        message.channel.send(`オブジェクトデーターを出力します。`);
        message.channel.send(JSON.stringify(ServerDATA));
    };

    if (message.content === '!debug_NIKKE') {//本業
        console.log("debug_nuking!")
    };
    //</デバッグ一覧>

    {//本番コマンド
        //   if (message.content === '!TWN_help') {//チャンネルを記録する
        //       message.channel.send(`IDなどのデーターを保存します。`);
        //      save_server_data(ServerDATA);
        //    };

        if (message.content.startsWith('!TWN_prop_plat')) {//プロパティにプラットフォームとユーザを紐づける
            //書式 !TWN_prop_plat prop/service$user
            const messagetext = message.content//メッセージの中身を一段で参照できるようにする。必要かは不明

            const PROPNAME = messagetext.substring(messagetext.indexOf('!TWN_prop_plat '), messagetext.indexOf('/')); //prop名
            const platname = messagetext.substring(messagetext.indexOf('/'), messagetext.indexOf('$')); //サービス
            const USERNAME = messagetext.substring(messagetext.indexOf('$')); //ユーザー名

            console.log('prop名:' + PROPNAME + ' サービス名:' + platname + ' ユーザー名:' + USERNAME)
            addPROP(ServerDATA, PROPNAME, platname, USERNAME)

            message.channel.send(`値を正しく設定しました。`);

            if (message.content === '!TWN_start') {//定義されたチャンネルにツイートを投げる
                message.channel.send("起動中...");
                // const PROPNAME = message.content.slice(11, message.content.indexOf("/")); //ユーザー名
                setInterval(async () => {//定期的にツイート等確認する
                    console.log("るーぷ");
                    const length = Object.keys(ServerDATA);//SERVERDATAちょっかのもろもろをしらべる
                    save_server_data(ServerDATA);
                    for (I_looper of ServerDATA) {//propの数を検知してその分だけまわす

                        const alpha = I_looper.indexOf("SID")
                        if (alpha !== 0) {//SIDを除外
                            if (!(I_looper === "emergancy")) {//emergancyを除外
                                //  console.log("君はどういう関数難題？" + I_looper)
                                try {
                                    const data_detail = {
                                        get_data_type: "USER",
                                        prop: I_looper,
                                        limit_get: Serverconifg.countlimit
                                    };
                                    await twitter_send(ServerDATA, data_detail);
                                } catch (error) {//想定外のエラーが出た場合にとりあえず動作を継続する
                                    any_notification(ServerDATA, "emergancy", "めちゃくちゃまずいで！(CV.茜ちゃん)")
                                    any_notification(ServerDATA, "emergancy", "エラーの名前はコレや:" + error.name)
                                    any_notification(ServerDATA, "emergancy", "エラーの内容はコレや:" + error.message)
                                }
                            };
                        };
                    };
                    console.log("無限ループやないで！")
                }, Serverconifg.looptime);
                Serverconifg.looptime
            };
            if (message.content.startsWith('!TWN_delete')) {//本業
                const messagetext = message.content//メッセージの中身を一段で参照できるようにする。必要かは不明
                const PROPNAME = messagetext.substring(message.content.indexOf('!TWN_delete ')); //ユーザー名
                if (ServerDATA[PROPNAME][message.guildId]) { delete ServerDATA[PROPNAME][message.guildId]; }
                message.channel.send(`通知を終了します。`);

            };
            if (message.content.startsWith('!TWN_set_prop')) {//プロパティにチャンネルを定義する

                // // const input =

                // // const input2 = 
                // const SERVICENAME = (message.content.slice(message.content.indexOf("/") + 1, message.content.indexOf("@"))); //サービス名

                //const PROPNAME = (message.content.slice(14));
                const messagetext = message.content//メッセージの中身を一段で参照できるようにする。必要かは不明
                const PROPNAME = messagetext.substring(messagetext.indexOf('!TWN_set_prop ')); //プロパティ名
                // setchannel(messege)//setchannelする（）
                find_serverID(ServerDATA, message, PROPNAME);
                message.channel.send(`チャンネルID: ${ServerDATA["SID" + message.guild.id].channelID} サーバーID: ${message.guild.id} プロパティ: ${PROPNAME}`);

                // message.channel.send('hi!');
            };
        };//</本番コマンド>









    };
});



