#include <string>
#include "game.h"
#define ReturnPyNone Py_INCREF(Py_None);return Py_None;

static CGame* s_lpGame = NULL;
static bool s_bInited = false;

//------------------------------------------------------------------------------
static void newGame() {
	s_lpGame = new CGame;
}

static PyObject* init_game(PyObject *self, PyObject* args) {
	char* cfg = NULL;
	char* log = NULL;

	if (!PyArg_ParseTuple(args, "ss", &cfg, &log)) {
		return Py_BuildValue("i", 0);
	}
	s_lpGame->SetConfig(cfg, log);

	if (!s_bInited) {
		if (!s_lpGame->Init()) {
			LOG("init game module failed!");
			delete s_lpGame;
			s_lpGame = NULL;
			return NULL;
		}
		LOG("game module init ok!");
		s_bInited = true;
	}
	return Py_BuildValue("i", 1);
}

//------------------------------------------------------------------------------
static PyObject* has_username(PyObject *self, PyObject* args) {
	char* user = NULL;
	if (!PyArg_ParseTuple(args, "s", &user)) {
		return NULL;
	}

	int ret = s_lpGame->HasUserName(user);
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* reg_account(PyObject *self, PyObject* args) {
	char* user = NULL;
	char* pwd = NULL;
	char* email = NULL;
	char* ip = NULL;
	char* comment = NULL;
	int commentflag = 0;

	if (!PyArg_ParseTuple(args, "sssssi", &user, &pwd, &email, &ip, &comment,
			&commentflag)) {
		return Py_BuildValue("i", 0);
	}

	int ret = s_lpGame->RegAccount(user, pwd, email, ip, comment, commentflag);
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* has_user_pwd(PyObject *self, PyObject* args) {
	char* user = NULL;
	char* pwd = NULL;

	if (!PyArg_ParseTuple(args, "ss", &user, &pwd)) {
		return Py_BuildValue("i", 0);
	}

	int ret = 0;
	if (user != NULL && pwd != NULL) {
		ret = s_lpGame->HasUserPwd(user, pwd);
	}
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* has_user_email(PyObject *self, PyObject* args) {
	char* user = NULL;
	char* email = NULL;
	if (!PyArg_ParseTuple(args, "ss", &user, &email)) {
		return Py_BuildValue("i", 0);
	}

	int ret = 0;
	if (user != NULL && email != NULL) {
		ret = s_lpGame->HasUserEmail(user, email);
	}
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* get_zonelist(PyObject *self, PyObject* args) {
	char* user = NULL;
	int flag = 0;
	if (!PyArg_ParseTuple(args, "si", &user, &flag)) {
		return NULL;
	}

	if (user != NULL) {
		PyObject * pyRows = s_lpGame->GetZonelist(user, flag);
		if (pyRows != NULL) {
			return Py_BuildValue("N", pyRows);
		}
	}

	return Py_BuildValue("N", PyList_New(0));
}

//------------------------------------------------------------------------------
static PyObject* get_zonegrouplist(PyObject *self, PyObject* args) {
	PyObject * pyRows = s_lpGame->GetZoneGrouplist();
	if (pyRows != NULL) {
		return Py_BuildValue("N", pyRows);
	}

	return Py_BuildValue("N", PyList_New(0));
}

//------------------------------------------------------------------------------
static PyObject* change_userpassword(PyObject *self, PyObject* args) {
	char* user = NULL;
	char* newpwd = NULL;
	if (!PyArg_ParseTuple(args, "ss", &user, &newpwd)) {
		return Py_BuildValue("i", 0);
	}

	int ret = 0;
	if (user != NULL && newpwd != NULL) {
		ret = s_lpGame->ChangeUserpassword(user, newpwd);
	}
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* encode_sig(PyObject *self, PyObject* args) {
	char* buf = NULL;
	if (!PyArg_ParseTuple(args, "s", &buf)) {
		return NULL;
	}

	char outbuf[4096] = { 0 };
	if (buf != NULL) {
		s_lpGame->EncodeSigStr(buf, outbuf, sizeof(outbuf));
	}
	return Py_BuildValue("s", outbuf);
}

//------------------------------------------------------------------------------
static PyObject* decode_sig(PyObject *self, PyObject* args) {
	char* buf = NULL;
	if (!PyArg_ParseTuple(args, "s", &buf)) {
		return NULL;
	}

	char outbuf[4096] = { 0 };
	if (buf != NULL) {
		s_lpGame->DecodeSigStr(buf, outbuf, sizeof(outbuf));
	}
	return Py_BuildValue("s", outbuf);
}

//------------------------------------------------------------------------------
static PyObject* reload_zones(PyObject *self, PyObject* args) {
	int ret = s_lpGame->ReLoadZones() ? 1 : 0;
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* update_src(PyObject *self, PyObject* args) {
	int ret = s_bInited ? 1 : 0;
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* restart_server(PyObject *self, PyObject* args) {
	int ret = s_bInited ? 1 : 0;
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* reload_server(PyObject *self, PyObject* args) {
	int ret = s_bInited ? 1 : 0;
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* restart_apache(PyObject *self, PyObject* args) {
	int ret = s_bInited ? 1 : 0;
	return Py_BuildValue("i", ret);
}

//------------------------------------------------------------------------------
static PyObject* delete_roles(PyObject *self, PyObject* args) {
	if (s_lpGame != NULL) {
		s_lpGame->DeleteRoles();
	}
	return Py_BuildValue("i", 1);
}

static PyMethodDef app_methods[] = { { "has_username", has_username,
		METH_VARARGS, "" }, { "init_game", init_game, METH_VARARGS, "" }, {
		"reg_account", reg_account, METH_VARARGS, "" }, { "has_user_pwd",
		has_user_pwd, METH_VARARGS, "" }, { "has_user_email", has_user_email,
		METH_VARARGS, "" }, { "get_zonelist", get_zonelist, METH_VARARGS, "" },
		{ "get_zonegrouplist", get_zonegrouplist, METH_NOARGS, "" }, {
				"change_userpassword", change_userpassword, METH_VARARGS, "" },
		{ "encode_sig", encode_sig, METH_VARARGS, "" }, { "decode_sig",
				decode_sig, METH_VARARGS, "" }, { "reload_zones", reload_zones,
				METH_NOARGS, "" },
		{ "update_src", update_src, METH_NOARGS, "" }, { "restart_server",
				restart_server, METH_NOARGS, "" }, { "reload_server",
				reload_server, METH_NOARGS, "" }, { "restart_apache",
				restart_apache, METH_NOARGS, "" }, { "delete_roles",
				delete_roles, METH_NOARGS, "" }, { NULL, NULL } };

PyMODINIT_FUNC initcgame(void) {
	newGame();
	Py_InitModule("cgame", app_methods);
}
