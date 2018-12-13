using Assets.Scripts.game.resloader;
namespace Assets.Scripts.game
{
    class Global
    {
        static private ResLoader _resLoader = null;

        static public void create()
        {
            _resLoader = new ResLoader();
        }

        static public ResLoader resLoader
        {
            get { return _resLoader; }
        }
    }
}
