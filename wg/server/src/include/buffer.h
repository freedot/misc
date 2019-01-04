#ifndef _BUFFER_H_
#define _BUFFER_H_

template<typename T> class Buffer {
public:
	void Recount(int count) {
		if (count > m_maxCount) {
			T* data = new T[2 * count];
			if (m_data != NULL) {
				memcpy(data, m_data, m_count);
				delete[] m_data;
			}
			m_data = data;
			m_maxCount = 2 * count;
			m_count = count;
		} else if (count > 0) {
			m_count = count;
		}
	}

	int GetCount() {
		return m_count;
	}

	int GetBytesSize() {
		return m_count * (int)sizeof(T);
	}

	T* GetBuffer() {
		return m_data;
	}

	T* Get(int idx) {
		return m_data + idx;
	}

public:
	Buffer() :
			m_data(NULL), m_count(0), m_maxCount(0) {
	}

	Buffer(int count) :
			m_data(NULL), m_count(0), m_maxCount(0) {
		Recount(count);
	}

	~Buffer() {
		if (m_data != NULL) {
			delete[] m_data;
			m_data = NULL;
		}

		m_count = 0;
		m_maxCount = 0;
	}

private:
	T* m_data;
	int m_count;
	int m_maxCount;
};

#endif // _BUFFER_H_
