################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
./tolua_event.c \
./tolua_is.c \
./tolua_map.c \
./tolua_push.c \
./tolua_to.c 

OBJS += \
./tolua_event.o \
./tolua_is.o \
./tolua_map.o \
./tolua_push.o \
./tolua_to.o 

C_DEPS += \
./tolua_event.d \
./tolua_is.d \
./tolua_map.d \
./tolua_push.d \
./tolua_to.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ./%.c
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C Compiler'
	gcc -fPIC -I../include/lua -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


