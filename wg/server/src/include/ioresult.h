#ifndef _IO_RESULT_H_
#define _IO_RESULT_H_

namespace IO {

const int TQ_IO_OK = 0;
const int TQ_IO_ERR_PIPE_FULL = -1;
const int TQ_IO_ERR_PIPE_RECVBUF_LEN_LESS = -2;
const int TQ_IO_ERR_PIPE_EMPTY = -3;
const int TQ_IO_ERR_PIPE_INVALIEDPARAM = -4;

} // end namespace IO

#endif // _IO_RESULT_H_
