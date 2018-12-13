//==================================================================================
/// ElementsMapper
/// @qujianbiao
//==================================================================================

using UnityEngine;
using System.Collections.Generic;
namespace Assets.Scripts.game.ui
{
    public class ElementsMapper : MonoBehaviour
    {
        [System.Serializable]
        public struct ObjectPair
        {
            public string Name;
            public GameObject GameObject;
        }
        [SerializeField]
        public List<ObjectPair> Elements = new List<ObjectPair>(0);

        private Dictionary<string, GameObject> _elements = new Dictionary<string, GameObject>();

        void Awake()
        {
            for (int i = 0; i < Elements.Count; i++)
            {
                ObjectPair p = Elements[i];
                if (_elements.ContainsKey(p.Name))
                    Debug.LogError("In prefab [" + gameObject.name + "] elements mapper has duplicate name [" + p.Name + "]");

                _elements[p.Name] = p.GameObject;
            }
            Elements.Clear();
        }

        public GameObject GetElement(string name)
        {
            GameObject obj = null;
            if (!_elements.TryGetValue(name, out obj))
            {
                Debug.LogError("In prefab [" + gameObject.name + "] elements mapper not find gameobject [" + name + "]");
                return null;
            }
            return obj;
        }

        public T GetElement<T>(string name) where T : Component
        {
            GameObject obj = GetElement(name);
            if (obj == null)
                return null;

            T component = obj.GetComponent<T>();
            if (component == null)
                Debug.LogError("In prefab [" + gameObject.name + "] elements mapper not find component [" + typeof(T).Name + "] of gameobject [" + name + "]");

            return component;
        }
    }
}
