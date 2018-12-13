using UnityEngine;
namespace Assets.Scripts.game.ui
{
    public class TsForm
    {
        private GameObject _obj = null;
        private ElementsMapper _elems = null;
        public TsForm(GameObject obj)
        {
            _obj = obj;
            _elems = _obj.GetComponent<ElementsMapper>();
        }

        public void show()
        {
            _obj.SetActive(true);
        }

        public void hide()
        {
            _obj.SetActive(false);
        }

        public GameObject getElement(string name)
        {
            return _elems.GetElement(name);
        }

        public T getElement<T>(string name) where T : Component
        {
            return _elems.GetElement<T>(name);
        }
    }
}
