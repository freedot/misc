declare function IsMiniGame(): boolean;
declare function WxGetFriendRankList(): void;
declare function WxUpdateFriendRank(rank: { level: number, turnRound: number, coin: number, openId: string }): void;
declare function HttpPost(url: string, data: any, onSuccess: Laya.Handler, onFailed: Laya.Handler): void;

declare module wx {
    export class cloud {
        static init(): void;
        static callFunction(args: { name: string, data?: Object, success: (res: any) => void, fail: (err: any) => void }): void;
    }
}

declare module Laya {
    export class Handler {
        static create(o: Object, caller: (...args: any) => any): Handler;
        method: Function;
        caller: Object;
        run(): void;
    }

    export class timer {
        static once(duration: number, callerobj: Object, callermethod: (...args: any) => any): void;
    }

    export class Browser {
        static onMiniGame: any;
    }

    export class XmlHttpRequest {
        timeout: number;
    }

    export class HttpRequest {
        http: XmlHttpRequest;
        once(evenid: number, methodObj: Object, method: (result: any) => void): void;
        send(url: string, data: any, methodtype: string, contentType: string, ops: string[]): void;
    }

    export class Event {
        static COMPLETE: number;
        static ERROR: number;
    }
}

declare module data {
    export class StaticDataFactory {
        static findPost(slotId: number): any;
    }

    export class Post {
        static DATA_TYPE: number;
    }
}

declare module ui {
    export class View {
        createChildren(): void;
        createView(uicfg: any):void;
    }
}

declare module asgard {
    export module module {
        export class BaseModule {
        }

        export class ModuleManager {
            static getModule(moduleId: number): BaseModule;
        }
    }

    export module events {
        export class EventsDispatcher {
            static eventNotify(eventId: number): void;
            static registerEventListener(eventId: number, callerobj: Object, callermethod: (...args: any) => any): void;
        }
    }

    export module stage {
        export class EventsDispatcher {
            static eventNotify(eventId: number): void;
        }

        export class StageManager {
            static enterStage(stageId: number): void;
        }
    }

    export module ui {
        export class UIManager {
            static findUIPanel(panelId: string): any;
            static openView(panelId: string): any;
        }
    }

    export module data {
        export class StaticDataManager {
            static getSheetDatas(type: number): any[];
        }
    }
}

declare module logic {
    export let MODULE_PLAYER: number;
    export let MODULE_LIST: number;
    export let MODULE_SLOT: number;
    export let MODULE_SOCIAL: number;
    export let STAGE_ARENA: number;

    export class AddSlotType {
        static COIN: number;
        static DIAMON: number;
    }

    export class WeChat {
        static onShowQuery: {
            shareuser: string;
            prop: string;
        }
    }

    export class PlayerInfo {
        static REWARD_TYPE_DIAMON: number;

        luckyCount: number;
        luckyShareCount: number;
        loginRewardDays: number;
        lastLoginTime: number;
        turnRound: number;
        Diamon: number;
        Speed: number;
        Coin: number;
        loginDays: number;
        shareCoinCount: number;
        shareDiamonCount: number;
        luckyUpTime: number;
        nickName: string;
        avatarUrl: string;
        reset(flag?: boolean): void;
        addSpeedTime(t: number): void;
        showReward(diamon: number, e: any, logindayPanelId: string): void;
    }

    export class GameConst {
        static MAX_OFFLINE_TIME: number;
        static VERSION: number;
        static MAX_LEVEL: number;
        static FLY_LIMIT_HERO_COUNT: number;
        static LOCAL_CACHE_FILE_PATH: string;
        static SHARE_COUNT_URL: string;
        static REPORT_URL: string;
    }

    export class GameEvents {
        static EVENT_GAME_ONHIDE: number;
        static EVENT_GAME_ONSHOW: number;
        static EVENT_SHOW_BOX: number;
        static EVENT_UPDATE_LOGIN_REWARD: number;
        static EVENT_HIDE_BOX: number;
        static EVENT_UPDATE_LUCKY_TICKETS: number;
        static EVENT_GET_SHOP_LIST: number;
        static EVENT_COMBINE_NEW: number;
        static EVENT_UPDATE_ITEM_BUY_COUNT: number;
    }

    export class Utils {
        static setverTimestamp: number;
        static offsetTimestamp: number;
        static getTimestamp(): number;
    }

    export class PlatForm {
        static GetInstance(): PlatForm;
        writeData2File(path: string, content: string): void;
        readDataFromFile(path: string): string;
    }

    export class HttpServer {
        static Instance(): HttpServer;
        saveUserData(data: any, callback: Laya.Handler): void;
        getUserData(onSuccess: Laya.Handler, onFailed: Laya.Handler): void;
        queryLuckWheel(callback: Laya.Handler): void;
    }

    export class GuidePanel {
        static guideSteps: any[];
    }
}