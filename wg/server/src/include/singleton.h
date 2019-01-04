#ifndef _SINGLETON_H_
#define _SINGLETON_H_
#include "commhead.h"

template<class T>
class MyPtr{
private:
  T* ptr;
public:
  MyPtr():ptr(NULL) {
  }
  MyPtr(T* ptr) {
    this->ptr = ptr;
  }
  ~MyPtr() {
    if (ptr != NULL) {
      delete ptr;
    }
  }
  T* get() {
    return ptr;
  }
  void move(MyPtr<T>* other) {
    if (this != other) {
      other->ptr = this->ptr;
      this->ptr = NULL;
    }
  }
};


/** 单件基础类，该单件目前不支持多线程，实际的用法可以是
 class Test : public Singleton<Test>
 {
 DECLARE_SINGLETON(Test);
 ...
 private:
 Test(){...}
 };
 在派生类中的构造函数的私有化是确保进程内的唯一性。*/

template<class T>
class Singleton {
public:
	/** 返回该单件对象的实例 */
	static T* Instance() {
		if (m_instance.get() == NULL) {
			MyPtr<T> tins(new T);
      tins.move(&m_instance);
		}
		return m_instance.get();
	}

protected:
	/** 构造函数保护模式的目的是可以被继承但不能在其他体外实例化对象 */
	Singleton(void) {
	}
	/** 析构函数 */
	virtual ~Singleton(void) {
	}
	/** 拷贝构造函数,不实现 */
	Singleton(const Singleton<T>&);
	/** 付值函数,不实现 */
	Singleton<T>& operator=(const Singleton<T> &);
private:
	static MyPtr<T> m_instance;
};

template<class T>
MyPtr<T> Singleton<T>::m_instance;

#define DECLARE_SINGLETON( type ) \
	friend class MyPtr< type >;\
	friend class Singleton< type >;

#endif // _SINGLETON_H_
