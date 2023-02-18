import { segment } from "oicq";
import fetch from "node-fetch";
import { core } from "oicq";
import moment from "moment";
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import plugin from '../../lib/plugins/plugin.js'

let user_agent = [
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3; rv:11.0) like Gecko",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
    "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
    "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; The World)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Avant Browser)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)",
    "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
    "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
    "Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
    "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10",
    "Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13",
    "Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+",
    "Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0",
    "Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/20.0.019; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.18124",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)",
    "UCWEB7.0.2.37/28/999",
    "NOKIA5700/ UCWEB7.0.2.37/28/999",
    "Openwave/ UCWEB7.0.2.37/28/999",
    "Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999",
    //  iPhone 6：
    "Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25",
]


/* 借鉴了nonebot_plugin_warframe的输出格式以及查询接口，原址：https://github.com/17TheWord/nonebot-plugin-warframe
Api:https://api.null00.com/world/ZHCN
*/

//1.定义命令规则
export class warframe extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '星际战甲',
            /** 功能描述 */
            dsc: '星际战甲',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级,数字越小等级越高 */
            priority: 1045,
            rule: [{
                /** 命令正则匹配 */
                reg: '#wf菜单|#wf帮助', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'menu'
            }, {
                /** 命令正则匹配 */
                reg: '#wf警报(.*)|警报', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getAlerts'
            }, {
                /** 命令正则匹配 */
                reg: '#wf新闻(.*)', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getNews'
            },
            {
                /** 命令正则匹配 */
                reg: '#赛特斯(.*)|地球平原|平原时间', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getCetus'
            },
            {
                /** 命令正则匹配 */
                reg: '#地球时间(.*)|地球时间', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getEarth'
            },
            {
                /** 命令正则匹配 */
                reg: '#索拉里斯(.*)|#金星平原|金星平原', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getSolaris'
            },
            {
                /** 命令正则匹配 */
                reg: '#赏金(.*)|平原赏金|赏金', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getBounty'
            },
            {
                /** 命令正则匹配 */
                reg: '#裂隙(.*)|裂隙', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getFissures'
            },
            {
                /** 命令正则匹配 */
                reg: '奸商(.*)|wf奸商', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getTrader'
            },
            {
                /** 命令正则匹配 */
                reg: '#突击(.*)|突击|今日突击', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getSortie'
            },
            {
                /** 命令正则匹配 */
                reg: '#每日优惠(.*)', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getDailyDeals'
            },
            {
                /** 命令正则匹配 */
                reg: '#入侵(.*)', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getInvasions'
            },
            {
                /** 命令正则匹配 */
                reg: '#事件(.*)|热美亚|尸鬼', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getEvents'
            },
            {
                /** 命令正则匹配 */
                reg: '#电波(.*)|电波|电波任务', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getSeason'
            },
            {
                /** 命令正则匹配 */
                reg: '#wf信息', //匹配消息正则,命令正则
                /** 执行方法 */
                fnc: 'getImg'
            }
            ]

        })
    }
    async getImg(e) {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto("https://ordis.null00.com/v1/");
        await page.setViewport({
            width: 1200,
            height: 800
        });
        await page.screenshot({
            path: 'resources/wf.png',
            fullPage: true
        });

        await browser.close();
        await e.reply([segment.image('resources/wf.png')])

        fs.unlink('resources/wf.png', () => { });

    }

    //  菜单
    async menu(e) {
        let msg = "命令头：wf、warframe、星际战甲 \n" +
            "\n参数： \n" +
            "\n================== \n" +
            "\n  警 报  丨入侵丨     赏 金     丨  突击  丨 裂隙 \n" +
            "\n电波/章节丨地球丨赛特斯/地球平原丨索拉里斯/金星平原 \n" +
            "\n  奸 商  丨事件丨     新 闻     丨    每日优惠    "
        e.reply(msg)
    }
    // 警报
    async getAlerts(e) {
        let data = await getJsonData("alerts")
        logger.mark(data)
        let temp_alerts = "         警报        \n=================="
        for (let alert in data) {
            temp_alerts += "\n" + data[alert].location + "\n" +
                "\n" + data[alert].missionType + "丨" + data[alert].faction + "（" + data[alert].minEnemyLevel + " ~ " + data[alert].maxEnemyLevel + "）" + "\n" +
                "\n奖励丨星币 * " + data[alert].credits
            let temp_reward = ""

            for (let alert_reward in data[alert].rewards) {
                temp_reward += "\n\t" + data[alert].rewards[alert_reward].item + "*" + data[alert].rewards[alert_reward].itemCount
                temp_alerts += temp_reward + "\n=================="
            }
        }
        e.reply(temp_alerts)
        /*   const browser = await puppeteer.launch({
              args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
          const page = await browser.newPage();
          await page.goto('https://ordis.null00.com/v1/');
          let body = await page.$('#component-alerts');
          await body.screenshot({
              path: 'resources/wfAlerts.png'
          });
          await browser.close();
          
          await e.reply([segment.image('resources/wfAlerts.png')]) */

    }

    //  新闻
    async getNews(e) {
        let data = await getJsonData("news")
        let temp_news = "        飞船新闻       \n=================="
        for (let newIndex in data) {
            let nTime = new Date(moment.unix(data[newIndex].date).format("YYYY-MM-DD HH:mm:ss"))
            temp_news += "\n" + data[newIndex].defaultMessages + "\n" +
                "\n时间丨" + await getFormatTime(nTime.getTime()) + " \n" +
                "\n链接丨" + data[newIndex].prop + "\n" +
                "\n=================="
        }

        e.reply(temp_news)
    }


    //  赛特斯
    async getCetus(e) {
        let data = await getJsonData("cetus")
        let day = ''
        if (data.day) {
            day = '白天'
        } else { day = '黑夜' }
        let cTime = new Date(moment.unix(data.cetusTime).format("YYYY-MM-DD HH:mm:ss"))

        let diffTime = cTime.getTime() - Date.now()
        if (diffTime < 0) {
            e.reply("查询错误，请稍后重试！")
        } else {
            let temp_cetus = "        地球平原       \n==========================\n" +
                "\n" + day + "剩余时间\t丨\t" + await calculationTimeDifference(diffTime) + "\n" +
                "\n昼夜交替时间\t丨\t" + await getFormatHms(cTime.getTime()) + " \n" +
                "\n==========================\n🔆 时间可能会有 1~2 分钟 误差 🌙"
            e.reply(temp_cetus)
        }
    }

    // 地球
    async getEarth(e) {
        let data = await getJsonData("earth")
        let day = ''
        if (data.day) {
            day = '白天'
        } else { day = '黑夜' }
        let eTime = new Date(moment.unix(data.earthDate).format("YYYY-MM-DD HH:mm:ss"))
        let diffTime = eTime.getTime() - Date.now()
        let temp_earth = "         地球        \n======================\n" +
            "\n" + day + "剩余\t丨\t" + await calculationTimeDifference(diffTime) + "\n" +
            "\n交替将于\t丨\t" + await getFormatHms(eTime.getTime()) + "\n" +
            "\n======================\n🔆 地球每四小时循环时间 🌙"
        e.reply(temp_earth)
    }


    // 索拉里斯
    async getSolaris(e) {
        let data = await getJsonData("solaris")
        let state = ''
        if (data.state == 2)
            state = '寒冷'
        else if (data.state in [4, 1])
            state = '极寒'
        else {
            state = '温暖'
        }
        let sTime = new Date(moment.unix(data.solarisExpiry).format("YYYY-MM-DD HH:mm:ss"))
        let diffTime = sTime.getTime() - Date.now()
        let msg = "       金星平原      \n==================\n" +
            "\n" + state + "\t丨\t" + await calculationTimeDifference(diffTime) + "\n" +
            "\n交替\t丨\t" + await getFormatHms(sTime.getTime()) + "\n" +
            "\n=================="
        e.reply(msg)

    }
    // 赏金
    async getBounty(e) {
        let data = await getJsonData("bounty")
        let temp_bounty = "         赏金        \n=================="
        for (let bounty in data) {
            let sTime = new Date(moment.unix(data[bounty].expiry).format("YYYY-MM-DD HH:mm:ss"))
            let diffTime = sTime.getTime() - Date.now()
            temp_bounty += "\n" + data[bounty].tag + "   剩余时间：" + await calculationTimeDifference(diffTime)

            let temp_jobs = ""
            let bountyData = data[bounty].jobs
            for (let job in bountyData) {
                temp_jobs += "\n\t" + bountyData[job].jobType +
                    "\n\t\t奖励：" + bountyData[job].rewards.replaceAll('<br />', '、')
            }
            temp_bounty += temp_jobs + "\n==================\n\t\t\t\t\t\t奖励列表的遗物不一定是正确的"
        }
        e.reply(temp_bounty)
    }


    // 裂隙
    async getFissures(e) {
        let data = await getJsonData("fissures")
        let temp_fissures = "         裂隙        \n"
        // let fTime = ''
        for (let fissure in data) {
            let fTime = new Date(moment.unix(data[fissure].expiry).format("YYYY-MM-DD HH:mm:ss"))
            let diffTime = fTime.getTime() - Date.now()
            temp_fissures += data[fissure].modifier + "\t丨\t" + data[fissure].missionType + "\t丨\t" + data[fissure].node + "\t丨\t" + await calculationTimeDifference(diffTime) + "\n"
        }

        e.reply(temp_fissures)
    }


    // 奸商
    async getTrader(e) {
        let data = await getJsonData("trader")
        let nowTime = Date.now()
        let jsTime = new Date(moment.unix(data.activationnew).format("YYYY-MM-DD HH:mm:ss"))
        let jsTime1 = new Date(moment.unix(data.expiry).format("YYYY-MM-DD HH:mm:ss"))
        let traderTime = ''
        if (nowTime < jsTime.getTime())
            traderTime = parseInt(jsTime.getTime() - nowTime - 86400)
        else
            traderTime = parseInt(jsTime1.getTime() - nowTime)
        let msg = "         奸商        \n==================\n" +
            "\n" + data.character + "\n" +
            "\n地点丨" + data.node + "\n" +
            "\n剩余丨" + await getFormatDhms(traderTime) + "\n" +
            "\n=================="
        e.reply(msg)
    }


    // 突击
    async getSortie(e) {
        let data = await getJsonData("sortie")
        let sTime = new Date(moment.unix(data.expiry).format("YYYY-MM-DD HH:mm:ss"))
        let diffTime = sTime.getTime() - Date.now()
        let temp_sortie = "         突击        \n==================\n" +
            "\n" + data.boss + ":" + await calculationTimeDifference(diffTime) + "\n" +
            "\n" + data.faction
        for (let variants in data.variants) {
            temp_sortie += "\n\t" + data.variants[variants].missionType + "\t丨\t" + data.variants[variants].node + "\t丨\t" + data.variants[variants].modifierType
        }
        e.reply(temp_sortie)
    }


    // 每日优惠
    async getDailyDeals(e) {
        let data = await getJsonData("deals")
        let temp_daily_deals = "         今日优惠        \n==================\n"
        for (let daily_deal in data) {
            let dTime = new Date(moment.unix(data[daily_deal].expiry).format("YYYY-MM-DD HH:mm:ss"))
            let diffTime = dTime.getTime() - Date.now()
            temp_daily_deals += data[daily_deal].item + "丨" + data[daily_deal].discount + "%折扣丨" + data[daily_deal].salePrice + "白金丨剩余 " + await calculationTimeDifference(diffTime) + "\n"
        }
        e.reply(temp_daily_deals)
    }

    // 入侵
    async getInvasions(e) {
        let data = await getJsonData("invasions")
        let temp_invasions = "         入侵        \n==================\n"
        for (let invasion in data) {
            temp_invasions += data[invasion].node + "\t丨\t" + data[invasion].locTag + " \t丨\t"
            if (data[invasion].attacker.rewards) {
                for (let attacker_reward in data[invasion].attacker.rewards)
                    temp_invasions += data[invasion].attacker.rewards[attacker_reward].item + "*" + data[invasion].attacker.rewards[attacker_reward].itemCount
                temp_invasions += " / "
            }
            for (let defender_reward in data[invasion].defender.rewards) {
                temp_invasions += data[invasion].defender.rewards[defender_reward].item + "*" + data[invasion].defender.rewards[defender_reward].itemCount + "\n"
            }

        }

        e.reply(temp_invasions)
        /*         const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();
                await page.goto('https://ordis.null00.com/v1/');
                let body = await page.$('#component-invasions');
                await body.screenshot({
                    path: 'resources/wfInvasions.png'
                });
                await browser.close();
                await e.reply([segment.image('resources/wfInvasions.png')]) */
    }


    // 事件
    async getEvents(e) {
        let data = await getJsonData("events")
        let temp_event = "         事件        \n"
        for (let myEvent in data) {
            let dTime = new Date(moment.unix(data[myEvent].expiry).format("YYYY-MM-DD HH:mm:ss"))
            let diffTime = dTime.getTime() - Date.now()
            temp_event += "(" + data[myEvent].tag + ")距离结束时间丨" + await calculationTimeDifference(diffTime) + " | 已完成" + data[myEvent].healthPct + "\n"
        }
        e.reply(temp_event)
    }


    // 电波
    async getSeason(e) {
        let data = await getJsonData("season")
        let temp_season = "         电波任务        \n"
        for (let challenge in data.challenges) {
            temp_season += data.challenges[challenge].cycle + "\t丨\t" + data.challenges[challenge].xp + "xp\t丨\t" + data.challenges[challenge].challenge + "\n"
        }
        e.reply(temp_season)
    }







}


//  格式化时间
async function getFormatTime(time) {
    var myDate = new Date(time);	//创建Date对象
    var Y = myDate.getFullYear();   //获取当前完整年份
    var M = myDate.getMonth() + 1;  //获取当前月份
    var D = myDate.getDate();   //获取当前日1-31
    var H = myDate.getHours();  //获取当前小时
    var i = myDate.getMinutes();    //获取当前分钟
    var s = myDate.getSeconds();    //获取当前秒数
    // 月份不足10补0
    if (M < 10) {
        M = '0' + M;
    }
    // 日不足10补0
    if (D < 10) {
        D = '0' + D;
    }
    // 小时不足10补0
    if (H < 10) {
        H = '0' + H;
    }
    // 分钟不足10补0
    if (i < 10) {
        i = '0' + i;
    }
    // 秒数不足10补0
    if (s < 10) {
        s = '0' + s;
    }
    // 拼接日期分隔符根据自己的需要来修改
    return Y + '-' + M + '-' + D + ' ' + H + ':' + i + ':' + s;
}
// 年月日
async function getFormatHms(time) {
    var myDate = new Date(time);	//创建Date对象
    var H = myDate.getHours();  //获取当前小时
    var i = myDate.getMinutes();    //获取当前分钟
    var s = myDate.getSeconds();    //获取当前秒数

    // 小时不足10补0
    if (H < 10) {
        H = '0' + H;
    }
    // 分钟不足10补0
    if (i < 10) {
        i = '0' + i;
    }
    // 秒数不足10补0
    if (s < 10) {
        s = '0' + s;
    }
    // 拼接日期分隔符根据自己的需要来修改
    return H + '时' + i + '分' + s + '秒';

}

async function calculationTimeDifference(timeDifference) {
    let hours = Math.floor(timeDifference / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    return hours + "时" + minutes + "分" + seconds + "秒"
}
async function getFormatDhms(timeDifference) {
    let days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)))
    let hours = Math.floor(timeDifference / (1000 * 60 * 60) % 24);
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    days = days < 10 ? '0' + days : days
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds

    return days + "天" + hours + "时" + minutes + "分" + seconds + "秒"
}



//  API 获取 Json 数据
async function getJsonData(url_arg) {
    let api_url = "https://api.null00.com/world/ZHCN/" + url_arg

    let data1 = await fetch(api_url, {
        headers: {
            "User-Agent": user_agent[Math.floor((Math.random() * user_agent.length))]
        }
    })

    return await data1.json()

}



