################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../ActTowerRank.cpp \
../DirtyWordFilter.cpp \
../GridsManager.cpp \
../ProxyServer.cpp \
../RankManager.cpp \
../RankTemplet.cpp \
../RoleRank.cpp \
../ScriptPub.cpp \
../gamesvr.cpp 

OBJS += \
./ActTowerRank.o \
./DirtyWordFilter.o \
./GridsManager.o \
./ProxyServer.o \
./RankManager.o \
./RankTemplet.o \
./RoleRank.o \
./ScriptPub.o \
./gamesvr.o 

CPP_DEPS += \
./ActTowerRank.d \
./DirtyWordFilter.d \
./GridsManager.d \
./ProxyServer.d \
./RankManager.d \
./RankTemplet.d \
./RoleRank.d \
./ScriptPub.d \
./gamesvr.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -fPIC -DDEBUG -I../../include -I../../include/tinyxml -O0 -g3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


