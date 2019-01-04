################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../src/lib_aux.c \
../src/lib_base.c \
../src/lib_bit.c \
../src/lib_debug.c \
../src/lib_ffi.c \
../src/lib_init.c \
../src/lib_io.c \
../src/lib_jit.c \
../src/lib_math.c \
../src/lib_os.c \
../src/lib_package.c \
../src/lib_string.c \
../src/lib_table.c \
../src/lj_alloc.c \
../src/lj_api.c \
../src/lj_asm.c \
../src/lj_bc.c \
../src/lj_bcread.c \
../src/lj_bcwrite.c \
../src/lj_carith.c \
../src/lj_ccall.c \
../src/lj_ccallback.c \
../src/lj_cconv.c \
../src/lj_cdata.c \
../src/lj_char.c \
../src/lj_clib.c \
../src/lj_cparse.c \
../src/lj_crecord.c \
../src/lj_ctype.c \
../src/lj_debug.c \
../src/lj_dispatch.c \
../src/lj_err.c \
../src/lj_ffrecord.c \
../src/lj_func.c \
../src/lj_gc.c \
../src/lj_gdbjit.c \
../src/lj_ir.c \
../src/lj_lex.c \
../src/lj_lib.c \
../src/lj_load.c \
../src/lj_mcode.c \
../src/lj_meta.c \
../src/lj_obj.c \
../src/lj_opt_dce.c \
../src/lj_opt_fold.c \
../src/lj_opt_loop.c \
../src/lj_opt_mem.c \
../src/lj_opt_narrow.c \
../src/lj_opt_sink.c \
../src/lj_opt_split.c \
../src/lj_parse.c \
../src/lj_record.c \
../src/lj_snap.c \
../src/lj_state.c \
../src/lj_str.c \
../src/lj_strscan.c \
../src/lj_tab.c \
../src/lj_trace.c \
../src/lj_udata.c \
../src/lj_vmevent.c \
../src/lj_vmmath.c \
../src/ljamalg.c \
../src/luajit.c 

OBJS += \
./src/lib_aux.o \
./src/lib_base.o \
./src/lib_bit.o \
./src/lib_debug.o \
./src/lib_ffi.o \
./src/lib_init.o \
./src/lib_io.o \
./src/lib_jit.o \
./src/lib_math.o \
./src/lib_os.o \
./src/lib_package.o \
./src/lib_string.o \
./src/lib_table.o \
./src/lj_alloc.o \
./src/lj_api.o \
./src/lj_asm.o \
./src/lj_bc.o \
./src/lj_bcread.o \
./src/lj_bcwrite.o \
./src/lj_carith.o \
./src/lj_ccall.o \
./src/lj_ccallback.o \
./src/lj_cconv.o \
./src/lj_cdata.o \
./src/lj_char.o \
./src/lj_clib.o \
./src/lj_cparse.o \
./src/lj_crecord.o \
./src/lj_ctype.o \
./src/lj_debug.o \
./src/lj_dispatch.o \
./src/lj_err.o \
./src/lj_ffrecord.o \
./src/lj_func.o \
./src/lj_gc.o \
./src/lj_gdbjit.o \
./src/lj_ir.o \
./src/lj_lex.o \
./src/lj_lib.o \
./src/lj_load.o \
./src/lj_mcode.o \
./src/lj_meta.o \
./src/lj_obj.o \
./src/lj_opt_dce.o \
./src/lj_opt_fold.o \
./src/lj_opt_loop.o \
./src/lj_opt_mem.o \
./src/lj_opt_narrow.o \
./src/lj_opt_sink.o \
./src/lj_opt_split.o \
./src/lj_parse.o \
./src/lj_record.o \
./src/lj_snap.o \
./src/lj_state.o \
./src/lj_str.o \
./src/lj_strscan.o \
./src/lj_tab.o \
./src/lj_trace.o \
./src/lj_udata.o \
./src/lj_vmevent.o \
./src/lj_vmmath.o \
./src/ljamalg.o \
./src/luajit.o 

C_DEPS += \
./src/lib_aux.d \
./src/lib_base.d \
./src/lib_bit.d \
./src/lib_debug.d \
./src/lib_ffi.d \
./src/lib_init.d \
./src/lib_io.d \
./src/lib_jit.d \
./src/lib_math.d \
./src/lib_os.d \
./src/lib_package.d \
./src/lib_string.d \
./src/lib_table.d \
./src/lj_alloc.d \
./src/lj_api.d \
./src/lj_asm.d \
./src/lj_bc.d \
./src/lj_bcread.d \
./src/lj_bcwrite.d \
./src/lj_carith.d \
./src/lj_ccall.d \
./src/lj_ccallback.d \
./src/lj_cconv.d \
./src/lj_cdata.d \
./src/lj_char.d \
./src/lj_clib.d \
./src/lj_cparse.d \
./src/lj_crecord.d \
./src/lj_ctype.d \
./src/lj_debug.d \
./src/lj_dispatch.d \
./src/lj_err.d \
./src/lj_ffrecord.d \
./src/lj_func.d \
./src/lj_gc.d \
./src/lj_gdbjit.d \
./src/lj_ir.d \
./src/lj_lex.d \
./src/lj_lib.d \
./src/lj_load.d \
./src/lj_mcode.d \
./src/lj_meta.d \
./src/lj_obj.d \
./src/lj_opt_dce.d \
./src/lj_opt_fold.d \
./src/lj_opt_loop.d \
./src/lj_opt_mem.d \
./src/lj_opt_narrow.d \
./src/lj_opt_sink.d \
./src/lj_opt_split.d \
./src/lj_parse.d \
./src/lj_record.d \
./src/lj_snap.d \
./src/lj_state.d \
./src/lj_str.d \
./src/lj_strscan.d \
./src/lj_tab.d \
./src/lj_trace.d \
./src/lj_udata.d \
./src/lj_vmevent.d \
./src/lj_vmmath.d \
./src/ljamalg.d \
./src/luajit.d 


# Each subdirectory must supply rules for building sources it contributes
src/%.o: ../src/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C Compiler'
	gcc -fPIC -O2 -g -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


