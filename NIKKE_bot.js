//もろもろ初期化
//いろいろ定義
const Twit = require('twitter');//twitterのライブラリ
// const T = new Twit(twconfig);//Tがtwitterの呼び出しライブラリ
// const twconfig = require('./twconfig');//twitter APIのもろもろ
const { Client, GatewayIntentBits, Partials } = require('discord.js'); //discord.js から読み込む
// const DiscordBASE = require('discord.js');//DISCORDライブラリの呼び出し
const fs = require('fs');//FILE読み書きするやつ
// const DICONFIG = JSON.parse(dicondigtext.toString());
// const DISCORD = new DiscordBASE.Client(Discord.Intents.ALL);
//これってサーバーごとに必要とかそういうあれじゃないよね...多分
// const ditext = fs.readFileSync("./diconfig.json", 'utf8');//CONFIG読み出し
// const CONFIG = JSON.parse(ditext.toString());
const twconfig = JSON.parse(fs.readFileSync("./config/twconfig.json", 'utf8').toString());//APIKEY読み出し 前回やったね☆ 
const dicondigtext = JSON.parse(fs.readFileSync("./config/diconfig.json", 'utf8').toString());//CONFIG読み出し 前回やったね☆
// const serverID = JSON.parse(fs.readFileSync("./serverID.json", 'utf8').toString());//鯖ID読み出し
// const channelID = JSON.parse(fs.readFileSync("./channelID.json", 'utf8').toString());//チャンネルID呼び出し
const ServerDATA = JSON.parse(fs.readFileSync("./ServerDATA.json", 'utf8').toString());//チャンネルID呼び出し
const Serverconifg = JSON.parse(fs.readFileSync("./config/Serverconfig.json", 'utf8').toString());//チャンネルID呼び出し
const T = new Twit(twconfig);//Tがtwitterの呼び出しライブラリ
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
//ServerDATA-ServerID
//ServerDATA-ServerID-ChannelID
//ServerDATA-Server-ID-NIKKEFLAG
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
//     }
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
}); //clientインスタンスを作成する
//なっgggggggggggggggggggggggggggggggggggえぇよ
//DISCORD接続
async function ConectDiscord(dicondigtext) {//トークンで接続
    await DIclient.login(dicondigtext.token);
};
DIclient.once('ready', () => { console.log(`${DIclient.user.tag} Ready`); });//接続に完了したことを表示する
ConectDiscord(dicondigtext)
// DIclient.on('message', message => {
//     if (message.content === '!send') {
//         console.log(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
//         message.channel.send(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
//     }
// });

//function一覧
//ベースライブラリ(モジュール化してもいいくらい基本的な関数)
function savejson(saveDATA, Jsonname, log_flag) {//jsonセーブするためだけにこんなのいちいち書いてられないよね
    const jsonData = JSON.stringify(saveDATA);
    fs.writeFile(Jsonname, jsonData, (err) => {
        if (err) {
            if (log_flag == true) { console.error(err) };
            return;
        }
        if (log_flag == true) { console.log(Jsonname + ' saved successfully'); };
    });
}

function cloneObject(obj) {//最強。オブジェクトをコピーできる。
    let clone = {};
    Object.keys(obj).forEach((key) => {
        obj[key] != null && typeof obj[key] === 'object'
            ? (clone[key] = cloneObject(obj[key]))
            : (clone[key] = obj[key]);
    });
    return clone;
}

//他もろもろ

//Twitter関連

// const get_user_tweet = (userID, count) => {//指定されたユーザーの最新ツイートを取得する。
//     //userID 取得したいuserのID。@から指定できるはず
//     //count どこまで遡るか
//     const params = { screen_name: userID, count: count };
//     return new Promise(function (resolve, reject) {


// T.get('statuses/user_timeline', params, (error, tweets) => {
//     if (!error) {//正常処理
//         resolve(tweets);
//     } else {//もし返り値がerrorなら
//         reject(error);
//     }
// })

// function name(func) {
//     a = 1;
//     b = 2

//     if () {
//         func("errorcode", ["tweets"]);
//     }

//     return promise
// }


//     })
// };
///===================<Twwiterへの要求処理のテンプレ>=========================================

/**
 * 指定されたユーザーの最新ツイートを取得する。
 * @param {string} userID ユーザー名
 * @param {number} count 問い合わせる件数
 */

async function get_user_tweet(userID, count) {


    const params = { screen_name: userID, count: count };
    // const params = { screen_name: "sukesub", count: "1" };
    //  console.log("もうおしまいだよこのコード")
    const data = await new Promise((resolve, reject) => T.get('statuses/user_timeline', params, (err, data) => {
        if (!err) {
            resolve(data);
        } else {
            reject(err);
        }
    }));
    return data;

    //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    //     return (tweets);
    // } else {//もし返り値がerrorなら
    //     console.log("もうおしまいだよこのコード")
    //     throw "error";
    // }
}

///==================</Twwiterへの要求処理のテンプレ>=========================================

// global.get_user_tweet = get_user_tweet;

//Discord関連
function temp_ID() {

    return {
        "channelID": 0
    };
};


function any_notification(ServerDATA, DATANAME, TEXT) {//プロパティに登録してあるチャンネルに情報を一斉送信する
    // console.log("ここまでは来たんだけどなぁ")
    //呼び出し方:any_notification(ServerDATA(これで固定), DATANAME(送信したいプロパティ), TEXT(送信したい文字))
    // console.log("debug@:" + DATANAME)
    const DATANAMEprop = Object.keys(ServerDATA[DATANAME]);
    // console.log("FOR突入")

    for (let I = 0; I < DATANAMEprop.length; I++) {
        //   console.log("ループってなんすか？" + DATANAMEprop[I] + ";" + DATANAMEprop.length)
        // console.log(ServerDATA[DATANAME])
        //  console.log("でーたねーむ？:" + DATANAME)
        //    console.log(DATANAMEprop[I])

        if (DATANAMEprop[I] !== "USER") {
            // console.log("send突入22！")
            if ((DATANAMEprop[I] !== "plat")) {
                if (DATANAMEprop[I] !== "last") {
                    // console.log("send突入！")
                    //サーバ一覧のIDを引っ張り出す
                    //object.keyに対する配列番号によるデーターの取得
                    //ServerDATA[NIKKE_ID_LIST]==Server.DATAの、"SID"+ServerDATA.[DATENAME]に対するkeyの配列番号を用いたキーの取得
                    // console.log("aaa")
                    // console.log(DATANAMEprop[I])
                    // console.log(ServerDATA[NIKKE_ID_LIST])
                    // console.log(ServerDATA)
                    // console.log(NIKKE_ID_LIST)
                    // console.log("ここまでは来たんだけどなぁ")
                    //    console.log("えぇ..." + NIKKE_ID_LIST)
                    console.log(DATANAMEprop[I])
                    console.log(ServerDATA[DATANAME][DATANAMEprop[I]])
                    sendmessege(DATANAMEprop[I], ServerDATA[DATANAME][DATANAMEprop[I]].CID, TEXT)
                };
            };
        };
    };
    // console.log("FOR解放！")
};

function sendmessege(SID, CID, messege) {//指定されたチャンネルにメッセージを送る
    // console.log("少なくともここまでは実行されている")
    DIclient.guilds.cache.get(SID)
    DIclient.channels.cache.get(CID)
        .send(messege);
    // .send(messege);
};

//DB管理
// function niike_flag_find(ServerDATA) {
//     const properties = Object.keys(ServerDATA);
//     ServerDATA.NIKKECOUNT
//     for (I = 0; I < properties.length; I++) {

//     };
// }


function save_server_data(ServerDATA) {//チャンネルに関する情報を保存する
    savejson(ServerDATA, "ServerDATA.json", 1)

};
function addPROP(ServerDATA, PROPNAME, platname, USERNAME) {//PROPに詳細が追加されたりした場合に追加などをする
    if (!ServerDATA[PROPNAME]) { ServerDATA[PROPNAME] = {} };
    ServerDATA[PROPNAME].plat = platname;
    ServerDATA[PROPNAME].USER = USERNAME;
}
function find_serverID(ServerDATA, message, moreFLAG) {//呼び出し元のサーバーIDを探し、なければ作成。すべてオブジェクト
    // console.log(ServerDATA);
    const ID_ = "SID" + message.guild.id;
    if (ServerDATA[ID_]) { //ServerIDの何番が要求元のIDか判断する
        ServerDATA[ID_].channelID = message.channel.id; //存在していればチャンネルを上書きする
    } else { //していなければ作成する
        console.log("サーバーIDが存在しません。作成します。");
        ServerDATA["SID" + message.guild.id] = temp_ID()//テンプレートをコピーし生成
        // ServerDATA["SID" + message.guild.id] = message.guild.id;
        ServerDATA["SID" + message.guild.id].channelID = message.channel.id;//チャンネルIDをを書き込む
        ServerDATA["SID" + message.guild.id].serverID = message.guild.id;//鯖IDをを書き込む
        console.log("サーバーID:ServerDATA." + ServerDATA["SID" + message.guild.id]);
        const length = Object.keys(ServerDATA)
        console.log("現在の鯖カウント:" + length.length);
        // console.log(ServerDATA);
    }

    // console.log(moreFLAG)
    if (!ServerDATA[moreFLAG]) {
        ServerDATA[moreFLAG] = {}
    };
    // const length2 = Object.keys(ServerDATA[moreFLAG])
    ServerDATA[moreFLAG][message.guild.id] = { CID: {} }
    ServerDATA[moreFLAG][message.guild.id].CID = message.channel.id

}
/**
 * //twitterから情報を取得しdiscordのサー-バーに流す。thenまで内蔵しているためpromiceを得る必要はない...?
 *     //  data_detail.get_data_type      //ツイッターに問い合わせるRequestの種類。これがすべての始まりになり得る。
 *   //  data_detail.request_content    //ツイッターのIDや検索ワードなどのデータ
 *   //  data_detail.prop               //プロパティの名前
 *   //  data_detail.URL                //twitterに問い合わせるリンク。
 *   //  data_detail.count              //ツイートをいくつまで遡って取得するか
 *   //  data_detail.limit_get          //取得できていないツイートをいくつまで遡って取得するか 0の場合は一件しか取得しない
 *   //  data_detail.latest_ID          //最後に入力したtweetのIDを覚えておく
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

/**
 * 
 *data_detail.get_data_type      //ツイッターに問い合わせるRequestの種類。これがすべての始まりになり得る。
 *data_detail.request_content    //ツイッターのIDや検索ワードなどのデータ
 *data_detail.prop               //プロパティの名前
 *data_detail.URL                //twitterに問い合わせるリンク。
 *data_detail.count              //ツイートをいくつまで遡って取得するか
 *data_detail.limit_get          //取得できていないツイートをいくつまで遡って取得するか 0の場合は一件しか取得しない
 * data_detail.latest_ID          //最後に入力したtweetのIDを覚えておく
 *@param {object} ServerDATA いつもの。データーの塊なのでとりあえず書いとけばおｋ
 *@param {object} data_detail 問いあわせにつかうデーターセット。書き方は宣言の下にある。
/** twitterから情報を取得しdiscordのサーバーに流す。 */
async function twitter_send(ServerDATA, data_detail) {//twitterから情報を取得しdiscordのサーバーに流す。thenまで内蔵しているためpromiceを得る必要はない...?
    //オブジェクトとして転送するのがベストではないかと思われ

    //  data_detail.get_data_type      //ツイッターに問い合わせるRequestの種類。これがすべての始まりになり得る。
    //  data_detail.request_content    //ツイッターのIDや検索ワードなどのデータ
    //  data_detail.prop               //プロパティの名前
    //  data_detail.URL                //twitterに問い合わせるリンク。
    //  data_detail.count              //ツイートをいくつまで遡って取得するか
    //  data_detail.limit_get          //取得できていないツイートをいくつまで遡って取得するか 0の場合は一件しか取得しない
    //  data_detail.latest_ID          //最後に入力したtweetのIDを覚えておく

    ////[実装済みリスト]
    //USER = 
    //
    ////[/実装済みリスト]

    //↓ユーザに繋げる場合の例
    //"https://twitter.com/" + tweet[0].user.id + "/status/" + tweet[0].id_str // twitterへの問い合わせのコード
    //↑例
    // function any_notification(ServerDATA, DATANAME, TEXT) {//プロパティに登録してあるチャンネルに情報を一斉送信する
    //呼び出し方:any_notification(ServerDATA(これで固定), DATANAME(送信したいプロパティ), TEXT(送信したい文字))

    if (data_detail.get_data_type == "USER") {//ユーザーのデータを要求された場合
        if (!data_detail.limit_get == 0) {//遡る件数を指定された場合遡る
            // console.log("あ１１１１１１１１？")
            let skipflag = 0
            let tweet = {}
            let errorflag = 0
            for (let I = 0; I < data_detail.limit_get; I++) {
                // console.log(I)
                // console.log("あa？")
                // console.log("ほげ" + I)

                try {
                    tweet = await get_user_tweet(ServerDATA[data_detail.prop].USER, (I + 1))
                    //  console.log("あれ？:" + ServerDATA[data_detail.prop].last + "なんかおかしくね？:" + tweet[0].id)
                    // const twitter2 = Object.keys(tweet)
                    // console.log(twitter2)
                    if (ServerDATA[data_detail.prop].last == tweet[0].id) {
                        skipflag = 1
                        //      console.log("スキップしてねぇかコレ？")
                        break;
                    }


                    // console.log("ツイート取れてますよ～？:")
                    // console.log(Object.keys(tweet))c


                } catch (error) {//何らかの理由により取得できなかった場合
                    console.log("Error!111");
                    //緊急事態宣言をしなきゃ...
                    // emergancy = 緊急事態宣言のタグ
                    //   console.log(" any_notificationってなんだっけ")
                    errorflag = 1
                    any_notification(ServerDATA, "emergancy", "なにかbotに障害が出ています！get_user_tweetのpromiseがエラーを吐いたようです！")//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
                }
                // console.log("AA")
                // console.log(I)
                if (errorflag !== 1) {
                    if (data_detail.latest_ID == tweet[I].id) { break; }
                }
            };
            try {
                if (!skipflag == 1) {
                    //ここからは入手したデーターの変換処理 & 古いものから順に流すためにいろいろする    
                    // for (I = 0; I < DATANAMEprop.length; I++) {
                    //     //サーバ一覧のIDを引っ張り出す
                    //     const NIKKE_ID_LIST = "SID" + DATANAMEprop[I]//↑のobject.keyに対する配列番号によるデーターの取得
                    //     //ServerDATA[NIKKE_ID_LIST]==Server.DATAの、"SID"+ServerDATA.[DATENAME]に対するkeyの配列番号を用いたキーの取得
                    //     sendmessege(ServerDATA[NIKKE_ID_LIST].serverID, ServerDATA[NIKKE_ID_LIST].channelID, TEXT)
                    // };
                    // console.log(tweet)
                    const length2 = Object.keys(tweet)

                    // console.log("コンプリート!:" + length2.length - 1)

                    for (let I = 0; I < length2.length; I++) {
                        // console.log("コンプリート??:" + length2.length - I)
                        // console.log(tweet[0])
                        // console.log(tweet[1])
                        // console.log(tweet[2])

                        // console.log(tweet)
                        //console.log(length2.length)
                        // console.log(tweet[length2.length - I])
                        // console.log(I)
                        const text = "https://twitter.com/" + tweet[I].user.id + "/status/" + tweet[I].id_str//アクセスできる形式に変換
                        // any_notification(ServerDATA, data_detail.prop, text)//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
                        //     console.log("えぬってかわいいよね:" + I)
                        //

                        if (ServerDATA[data_detail.prop].last == tweet[I].id) {
                            skipflag = 1
                            //    console.log("スキップしてねぇかコレ？2")
                            break;
                        }

                        any_notification(ServerDATA, data_detail.prop, "[プレビュー表示用]");//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）


                        any_notification(ServerDATA, data_detail.prop, text)//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
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

            // console.log("コンプリート!22")
            // console.log("aaaa:" + skipflag)

            //     if (skipflag == 1) { any_notification(ServerDATA, data_detail.prop, "更新ないで？") }

        } else {//一件しか取得しない場合
            // try {

            // const tweet = await new Promise(resolve => setTimeout((data) => { resolve(data) }, 1000));
            //    console.log(ServerDATA[data_detail.prop])
            //  console.log(data_detail.prop)
            const tweet = await get_user_tweet(ServerDATA[data_detail.prop].USER, 1)
            // console.log(tweet)
            //  console.log("コンプリート")
            const text = "https://twitter.com/" + tweet[0].user.id + "/status/" + tweet[0].id_str//アクセスできる形式に変換
            any_notification(ServerDATA, data_detail.prop, text)//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
            // } catch (error) {//何らかの理由により取得できなかった場合
            //     console.log("Error!222");
            //     //緊急事態宣言をしなきゃ...
            //     // emergancy = 緊急事態宣言のタグ
            //     any_notification(ServerDATA, "emergancy", "なにかbotに障害が出ています!!!!!!!!！get_user_tweetのpromiseがエラーを吐いたようです！")//チャンネルに流す。引数は（[データ],プロパティの名前,送信内容のテキスト）
            // }
            //  console.log(tweet)

        }
    };

}


DIclient.on('messageCreate', async message => {//DISCORDのメッセージに関する処理いろいろ
    // if (message.author.bot) {
    //     return;
    // }

    //デバッグコマンド一覧

    if (message.content == '!debug_id') {//ID表示用のデバッグ
        // setchannel(messege)//setchannelする（）
        console.log(message.channel)//でばっぐ
        console.log(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
        message.channel.send(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);

        //     // message.channel.send('hi!');
        // };
        // if (message.content == '完成度は') {//ID表示用のデバッグDDD
        //     // setchannel(messege)//setchannelする（）
        //     console.log(message.channel)//でばっぐ
        //     console.log(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
        //     message.channel.send(`まだ２割！`);

        //     // message.channel.send('hi!');
        // };
        // if (message.content == 'ICEは') {//ID表示用のデバッグ
        //     // setchannel(messege)//setchannelする（）
        //     console.log(message.channel)//でばっぐ
        //     console.log(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
        //     message.channel.send(`天才！`);

        //     // message.channel.send('hi!');
    };


    if (message.content == '!debug_send') {//チャンネルにテストメッセージを送る
        // setchannel(messege)//setchannelする（）
        // console.log(message.channel)//でばっぐ
        // console.log(`);
        message.channel.send(`予約されたチャンネルに情報を送信します`);
        any_notification(ServerDATA, "DEBUG", "TESTING NOW")
        // message.channel.send(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);



        // serverID.server1 = message.guild.id
        // channelID.server1 = message.channel.id
        // message.channel.send(`チャンネルID: ${serverID.server1} サーバーID: ${channelID.server1}`);

        // message.channel.send('hi!');
    };
    //形式 !debugset プロパティ名!サービス名@ユーザー名



    // if (message.content == '!debug_set_NIKKE') {//テストチャンネルを定義する
    //     // setchannel(messege)//setchannelする（）
    //     // console.log(message.channel)//でばっぐ
    //     // console.log(`);
    //     message.channel.send(`このチャンネルの情報を保存します。`);
    //     // message.channel.send(`チャンネルID: ${message.channel.id} サーバーID: ${message.guild.id}`);
    //     find_serverID(ServerDATA, message, "NIKKE");
    //     message.channel.send(`チャンネルID: ${ServerDATA["SID" + message.guild.id].channelID} サーバーID: ${message.guild.id} `);

    //     // message.channel.send('hi!');
    // };


    if (message.content == '!debug_obj') {//チャンネルを記録する
        // setchannel(messege)//setchannelする（）
        // console.log(message.channel)//でばっぐ
        // console.log(`);
        message.channel.send(`オブジェクトデーターを出力します。`);
        // save_server_data(ServerDATA, moreDATA);
        message.channel.send(JSON.stringify(ServerDATA));
        // message.channel.send('hi!');
    };








    if (message.content == '!debug_NIKKE') {//本業
        // setchannel(messege)//setchannelする（）
        // console.log(message.channel)//でばっぐ
        // console.log(`);
        console.log("debug_nuking!")



        // const tempasync = async () => {
        //     const tweet = await get_user_tweet("sukesub", 5);
        //     // console.log(tweet)
        // }

    };
    //</デバッグ一覧>

    {//本番コマンド
        if (message.content == '!TWN_help') {//チャンネルを記録する
            // setchannel(messege)//setchannelする（）
            // console.log(message.channel)//でばっぐ
            // console.log(`);
            message.channel.send(`IDなどのデーターを保存します。`);
            save_server_data(ServerDATA);

            // message.channel.send('hi!');
        };

        if (message.content.startsWith('!TWN_prop_plat')) {//プロパティにプラットフォームとユーザを紐づける
            //書式例 !debug_prop_plat debug/twitter$suke

            const PROPNAME = message.content.slice(15, message.content.indexOf("/")); //ユーザー名
            const platname = message.content.slice(message.content.indexOf("/") + 1, message.content.indexOf("$")); //サービス
            const USERNAME = message.content.slice(message.content.indexOf("$") + 1); //ユーザー名

            console.log('prop名:' + PROPNAME + ' サービス名:' + platname + ' ユーザー名:' + USERNAME)
            addPROP(ServerDATA, PROPNAME, platname, USERNAME)

            message.channel.send(`値を正しく設定しました。`);
            // //if (存在しているのかチェック) {}
            // if (ServerDATA,)


            // find_serverID(ServerDATA, message, PROPNAME);
            // message.channel.send(`チャンネルID: ${ServerDATA["SID" + message.guild.id].channelID} サーバーID: ${message.guild.id} プロパティ: ${PROPNAME}`);

            // message.channel.send('hi!');
        };
        if (message.content == '!TWN_start') {//定義されたチャンネルにツイートを投げる
            // setchannel(messege)//setchannelする（）
            // console.log(message.channel)//でばっぐ
            // console.log(`);
            // console.log("debug nuking!")
            // any_notification(ServerDATA, "TESTING NOW")
            message.channel.send(`起動中...`);
            const PROPNAME = message.content.slice(11, message.content.indexOf("/")); //ユーザー名
            // const data_detail = {
            //     get_data_type: "USER",
            //     prop: "sukesub",
            //     limit_get: 3
            // }

            // await twitter_send(ServerDATA, data_detail)
            // console.log("あべし！（正式リリース目前の音）")
            setInterval(async () => {//定期的にツイート等確認する
                console.log("るーぷ")
                const length = Object.keys(ServerDATA)
                //  console.log("定期チェックやで")
                save_server_data(ServerDATA);
                for (I_looper = 0; I_looper < length.length; I_looper++) {//propの数を検知してその分だけまわす


                    //  console.log("何が起きてるんや？")


                    const alpha = length[I_looper].indexOf("SID")
                    //  console.log("えぇ:" + alpha + "なんで？" + length[I_looper])
                    if (alpha !== 0) {//SIDを除外
                        if (!(length[I_looper] == "emergancy")) {//emergancyを除外


                            //  console.log("君はどういう関数難題？" + length[I_looper])
                            const data_detail = {
                                get_data_type: "USER",
                                prop: length[I_looper],
                                limit_get: Serverconifg.countlimit
                            }
                            await twitter_send(ServerDATA, data_detail)
                        }
                    }
                }
                console.log("無限ループやないで！")
            }, Serverconifg.looptime);
            Serverconifg.looptime
            // any_notification(ServerDATA, "debug", "https://twitter.com/" + tweet[0].user.id + "/status/" + tweet[0].id_str)
        }


        if (message.content.startsWith('!TWN_delete')) {//本業
            // setchannel(messege)//setchannelする（）
            // console.log(message.channel)//でばっぐ
            // console.log(`);
            // console.log("debug_nuking!")

            const PROPNAME = message.content.slice(12); //ユーザー名
            if (ServerDATA[PROPNAME][message.guildId]) { delete ServerDATA[PROPNAME][message.guildId]; }
            message.channel.send(`通知を終了します。`);
            // const tempasync = async () => {
            //     const tweet = await get_user_tweet("sukesub", 5);
            //     // console.log(tweet)
            // }

        };
        if (message.content.startsWith('!TWN_set_prop')) {//プロパティにチャンネルを定義する

            // // const input =

            // // const input2 = 
            // const SERVICENAME = (message.content.slice(message.content.indexOf("/") + 1, message.content.indexOf("@"))); //サービス名
            const PROPNAME = (message.content.slice(14)); //プロパティ名
            // console.log('ユーザー名:' + USERNAME + ' サービス名:' + SERVICENAME + ' プロパティ名:' + PROPNAME);
            // console.log(input)
            // setchannel(messege)//setchannelする（）
            // console.log(message.channel)//でばっぐ
            // console.log(`);
            // message.channel.send(input);


            find_serverID(ServerDATA, message, PROPNAME);
            message.channel.send(`チャンネルID: ${ServerDATA["SID" + message.guild.id].channelID} サーバーID: ${message.guild.id} プロパティ: ${PROPNAME}`);

            // message.channel.send('hi!');
        };
        // console.log("404 Idea not found(アイデアがないよ！)")
    }//</本番コマンド>




    /**VScodeくんの変数の概要定義
     * @typedef {Object} DICONFIG DISCORDのconfigデータ
     * @typedef {Object} twconfig DISCORDのconfigデータ
     * @typedef {object} ServerDATA 鯖のデーター
     **/





});



