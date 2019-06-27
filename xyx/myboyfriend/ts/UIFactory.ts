module logic {
    export class UIPanelID {
        static LOADING = 'Loading';
        static JOYSTICK = 'JoyStick';
        static MAINMENU = 'Mainmenu';
        static ARENAMAIN = 'ArenaMain';
        static HEROLIST = 'HeroList';
        static NoCoinTip = 'NoCoinTip';
        static LEVELUPTIP = 'NewLevelTips';
        static OFFLINETIP = 'OfflineReward';
        static RANKLIST = 'RankList';
        static LOGINDAY = 'LoginDay';
        static SPEEDUP = 'SpeedUp';
        static ACHIVEMENT = 'FriendAchivemen';
        static INVITEFRIEND = 'InviteFriend';
        static REWARDTIP = 'RewardTip';
        static FRIENDHELP = 'FriendHelp';
        static BOXREWARD = 'BoxReward';
        static HOWPLAY = 'HowPlay';
        static INVITELOGIN = 'invitelogin';
        static LUCKYWHEEL = 'luckyWheel';
        static NOLUCKYTICKETS = 'NoLuckyTickets';
        static MOREGAME = 'Moregame';
        static GUIDETIP = 'GuideTip';
        static SUPRISE = 'Suprise';
        static MOONTIP = 'Moontip';
        static MSGBOX = 'MsgBox';
        static FLYTIP = 'FlyTip';
    }

    export class UIFactory {
        static addGuidView() {
            UIFactory.guidePanel || (UIFactory.guidePanel = new logic.GuidePanel(), asgard.ui.UIManager.addGuideView(UIFactory.guidePanel));
        }

        getUI(panelId: string) {
            switch (panelId) {
                case UIPanelID.LOADING:
                    return new logic.LoadingPanel(panelId);

                case UIPanelID.ARENAMAIN:
                    return new logic.ArenaMainPanel(panelId);

                case UIPanelID.HEROLIST:
                    return new logic.HeroListPanel(panelId);

                case UIPanelID.NoCoinTip:
                    return new logic.NoCoinTipsPanel(panelId);

                case UIPanelID.LEVELUPTIP:
                    return new logic.NewLevelTipsPanel(panelId);

                case UIPanelID.OFFLINETIP:
                    return new logic.OfflineReward(panelId);

                case UIPanelID.RANKLIST:
                    return new logic.RankListPanel(panelId);

                case UIPanelID.LOGINDAY:
                    return new logic.LoginDayPanel(panelId);

                case UIPanelID.SPEEDUP:
                    return new logic.SpeedUpPanel(panelId);

                case UIPanelID.INVITEFRIEND:
                    return new logic.IniviteFriendPanel(panelId);

                case UIPanelID.REWARDTIP:
                    return new logic.RewardTipPanel(panelId);

                case UIPanelID.BOXREWARD:
                    return new logic.BoxRewardPanel(panelId);

                case UIPanelID.HOWPLAY:
                    return new logic.HowPlayPanel(panelId);

                case UIPanelID.INVITELOGIN:
                    return new logic.InviteLogin(panelId);

                case UIPanelID.LUCKYWHEEL:
                    return new logic.LuckyWheelPanel(panelId);

                case UIPanelID.NOLUCKYTICKETS:
                    return new logic.NoTicketsPanel(panelId);

                case UIPanelID.MOREGAME:
                    return new logic.MoreGamePanel(panelId);

                case UIPanelID.GUIDETIP:
                    return new logic.GuideTipPanel(panelId);

                case UIPanelID.SUPRISE:
                    return new logic.SuprisePanel(panelId);

                case UIPanelID.MOONTIP:
                    return new logic.MoonTipPanel(panelId);

                case UIPanelID.MSGBOX:
                    return new logic.MsgBoxPanel(panelId);

                case UIPanelID.FLYTIP:
                    return new logic.FlyTipPanel(panelId);
            }
            return null;
        }

    }
}
