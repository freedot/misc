################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../src/host/buildvm.c \
../src/host/buildvm_asm.c \
../src/host/buildvm_fold.c \
../src/host/buildvm_lib.c \
../src/host/buildvm_peobj.c \
../src/host/minilua.c 

OBJS += \
./src/host/buildvm.o \
./src/host/buildvm_asm.o \
./src/host/buildvm_fold.o \
./src/host/buildvm_lib.o \
./src/host/buildvm_peobj.o \
./src/host/minilua.o 

C_DEPS += \
./src/host/buildvm.d \
./src/host/buildvm_asm.d \
./src/host/buildvm_fold.d \
./src/host/buildvm_lib.d \
./src/host/buildvm_peobj.d \
./src/host/minilua.d 


# Each subdirectory must supply rules for building sources it contributes
src/host/%.o: ../src/host/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C Compiler'
	gcc -fPIC -O2 -g -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


