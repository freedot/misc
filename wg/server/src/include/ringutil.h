#ifndef _RINGUTIL_H_
#define _RINGUTIL_H_

template<class _FI, class _FB> inline _FB GetRingQueuePrevIndex(_FI _SIZE,
		_FB _IDX) {
	return ((--_IDX + _SIZE) % _SIZE);
}

template<class _FI, class _FB> inline _FB GetRingQueueNextIndex(_FI _SIZE,
		_FB _IDX) {
	return ((++_IDX + _SIZE) % _SIZE);
}

template<class _FI, class _FB> inline _FB GetRingQueueDistance(_FI _SIZE,
		_FB _IDX1, _FB _IDX2) {
	_FB _DIS = GetRingQueueIndex(_SIZE, _IDX2)
			- GetRingQueueIndex(_SIZE, _IDX1);
	if (_DIS < 0) {
		_DIS += _SIZE;
	}
	return _DIS;
}

template<class _FI, class _FB> inline _FB GetRingQueueIndex(_FI _SIZE,
		_FB _IDX) {
	while (_IDX < 0) {
		_IDX += _SIZE;
	}
	return (_IDX % _SIZE);
}

template<class _FI, class _FB> inline _FB AdjustPosInRangeRingQueue(_FI _SIZE,
		_FB _FRONT, _FB _REAR, _FB _POS) {
	while (_FRONT < 0) {
		_FRONT += _SIZE;
	}

	while (_REAR < _FRONT) {
		_REAR += _SIZE;
	}

	while (_POS < _FRONT) {
		_POS += _SIZE;
	}

	if (_POS >= _REAR) {
		_POS = _FRONT;
	}

	return (_POS % _SIZE);

}

#endif // _RINGUTIL_H_
