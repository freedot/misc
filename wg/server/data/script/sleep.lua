local ffi = require("ffi")
ffi.cdef[[
void Sleep(int ms);
int poll(struct pollfd *fds, unsigned long nfds, int timeout);
]]

os.sleep = function(s)
	if ffi.os == "Windows" then
		ffi.C:Sleep(s*1000)
	else
		ffi.C:poll(nil, 0, s*1000)
	end
end;


