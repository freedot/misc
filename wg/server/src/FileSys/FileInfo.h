#ifndef FILEINFO_H_
#define FILEINFO_H_

namespace IO {
enum {
	FILE_TYPE_PKGFILE = 0, FILE_TYPE_FILE = 1,
};

class FileInfo {
public:
	int32 offset;
	int32 len;
	int32 factlen;
	FILE* fp;
	FileInfo() :
			offset(0), len(0), factlen(0), fp(0) {
	}
};

} /* namespace IO */

#endif //FILEINFO_H_
