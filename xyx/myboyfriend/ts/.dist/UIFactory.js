var logic;
(function (logic) {
    var UIPanelID = (function () {
        function UIPanelID() {
        }
        UIPanelID.LOADING = 'Loading';
        UIPanelID.JOYSTICK = 'JoyStick';
        UIPanelID.MAINMENU = 'Mainmenu';
        UIPanelID.ARENAMAIN = 'ArenaMain';
        UIPanelID.HEROLIST = 'HeroList';
        UIPanelID.NoCoinTip = 'NoCoinTip';
        UIPanelID.LEVELUPTIP = 'NewLevelTips';
        UIPanelID.OFFLINETIP = 'OfflineReward';
        UIPanelID.RANKLIST = 'RankList';
        UIPanelID.LOGINDAY = 'LoginDay';
        UIPanelID.SPEEDUP = 'SpeedUp';
        UIPanelID.ACHIVEMENT = 'FriendAchivemen';
        UIPanelID.INVITEFRIEND = 'InviteFriend';
        UIPanelID.REWARDTIP = 'RewardTip';
        UIPanelID.FRIENDHELP = 'FriendHelp';
        UIPanelID.BOXREWARD = 'BoxReward';
        UIPanelID.HOWPLAY = 'HowPlay';
        UIPanelID.INVITELOGIN = 'invitelogin';
        UIPanelID.LUCKYWHEEL = 'luckyWheel';
        UIPanelID.NOLUCKYTICKETS = 'NoLuckyTickets';
        UIPanelID.MOREGAME = 'Moregame';
        UIPanelID.GUIDETIP = 'GuideTip';
        UIPanelID.SUPRISE = 'Suprise';
        UIPanelID.MOONTIP = 'Moontip';
        UIPanelID.MSGBOX = 'MsgBox';
        UIPanelID.FLYTIP = 'FlyTip';
        return UIPanelID;
    }());
    logic.UIPanelID = UIPanelID;
    var UIFactory = (function () {
        function UIFactory() {
        }
        UIFactory.addGuidView = function () {
            UIFactory.guidePanel || (UIFactory.guidePanel = new logic.GuidePanel(), asgard.ui.UIManager.addGuideView(UIFactory.guidePanel));
        };
        UIFactory.prototype.getUI = function (panelId) {
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
        };
        return UIFactory;
    }());
    logic.UIFactory = UIFactory;
})(logic || (logic = {}));
//# sourceMappingURL=UIFactory.js.map