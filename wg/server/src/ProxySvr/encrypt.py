import struct  
import socket
from binascii import b2a_hex, a2b_hex
  
_DELTA = 0x9E3779B9  
  
def _long2str(v, w):  
    n = (len(v) - 1) << 2  
    if w:  
        m = socket.ntohl(v[-1])
        if (m < n - 3) or (m > n): return ''  
        n = m  
    s = struct.pack('<%iL' % len(v), *v)  
    return s[0:n] if w else s  

def _str2long(s, w):  
    n = len(s)  
    m = (4 - (n & 3) & 3) + n
    s = s.ljust(m, "\0")  
    v = list(struct.unpack('<%iL' % (m >> 2), s))  
    if w: v.append(socket.htonl(n))
    return v  
  
def encrypt(str, key):  
    if str == '': return str  
    v = _str2long(str, True)  
    k = _str2long(key.ljust(16, "\0"), False)  
    n = len(v) - 1  
    z = v[n]  
    y = v[0]  
    sum = 0  
    q = 6 + 52 // (n + 1)  
    while q > 0:  
        sum = (sum + _DELTA) & 0xffffffff  
        e = sum >> 2 & 3  
        for p in xrange(n):  
            y = v[p + 1]  
            v[p] = (v[p] + ((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z))) & 0xffffffff  
            z = v[p]  
        y = v[0]  
        v[n] = (v[n] + ((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4) ^ (sum ^ y) + (k[n & 3 ^ e] ^ z))) & 0xffffffff  
        z = v[n]  
        q -= 1  
    return b2a_hex(_long2str(v, False)).upper()

def decrypt(str, key):   
    if str == '': return str   
    v = _str2long(a2b_hex(str), False)   
    k = _str2long(key.ljust(16, "\0"), False)   
    n = len(v) - 1   
    z = v[n]   
    y = v[0]   
    q = 6 + 52 // (n + 1)   
    sum = (q * _DELTA) & 0xffffffff   
    while (sum != 0):   
        e = sum >> 2 & 3   
        for p in xrange(n, 0, -1):   
            z = v[p - 1]   
            v[p] = (v[p] - ((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z))) & 0xffffffff   
            y = v[p]   
        z = v[n]   
        v[0] = (v[0] - ((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4) ^ (sum ^ y) + (k[0 & 3 ^ e] ^ z))) & 0xffffffff   
        y = v[0]   
        sum = (sum - _DELTA) & 0xffffffff   
    return _long2str(v, True)   

  
if __name__ == "__main__":  
    key = '589fgjsk5239rq32'
    s = 'hello world!'
    print encrypt(s, key)
    print decrypt(encrypt(s, key), key)