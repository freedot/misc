/*
version.json  == > version.assetbundle
{"ver":"1.0.1.2", "listver":3412} // keep small


list.json  == > list.assetbundle
{
 "list":[
  {"file":"xxx.assetbundle", "pre":true, "fixed":false, "ver":3411},
  {"file":"xxx.assetbundle", "pre":true, "fixed":false, "ver":3412},
  {"file":"xxx.assetbundle", "pre":true, "fixed":false, "ver":3412},
  {"file":"xxx.assetbundle", "pre":true, "fixed":false, "ver":3412},
  {"file":"xxx.assetbundle", "pre":true, "fixed":true, "ver":3412},
  {"file":"xxx.assetbundle", "pre":false, "fixed":false, "ver":3412},
 ]
}

// c#
int getVersionFileVer(){ 
	int ver = readFromLocal();
	saveToLocal(++ver);
	return ver;
}

int downloadAssetBundles(){
	string baseurl = "http://xxx/";
	progress.show("check ver", 0, 0);
	AssetBundle verAB = WWW.loadOrCatch(baseurl + "version.assetbundle", getVersionFileVer());
	Json version = verAB.loadRes("version.json");
	string showVer = version["ver"];
	int listVer = version["list_ver"];
	
	progress.show("check file list", 0, 0);
	AssetBundle listAB = WWW.loadOrCatch(baseurl + "list.assetbundle", listVer);
	Json list = listAB.loadRes("list.json");
	
	Json lastList = loadLocalList();
	Json diffList = DiffListAndFilterUnPreDownload(list["list"], lastList);
	SaveListToLocal(list["list"]);
	
	if (diffList.count() == 0) {
		progress.show("newest version!", 0, 0);
		return;
	}
	
	progress.show("start update ", 0, diffList.count());
	for ( int i=0, n=diffList.count(); i<n; i++) {
		Json item = diffList[i];
		AssetBundle ab = WWW.loadOrCatch(baseurl + item["file"], item["ver"]); 
		if ( !item["fixed"] ) ab.Unload();
		progress.show("start update " + item["file"], i+1, n);
	}
	
	progress.show("update ok!", diffList.count(), diffList.count());
}
*/
