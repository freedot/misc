ui_res = {};
ui_res.storyEditDlg = {
	type:'widget'
	,modal: true
	,name: 'root'
	,dragTitle: 40
	,style:'dialog storyEditDlg'
	,escape:true
	,rect:{left:100, top:100, width:700, height:640}
	,items:[
		{
			type:'label'
			,text: string_res.StoryEditDlg.title
			,name:'title'
			,style:'dlgTitle'
			,rect:{left:0, top:0, width:700, height:35}
		}
		,{
			type:'image_button'
			,name:'closeBtn'
			,style:'dlgclose_icon'
			,rect:{left:670, top:7, width:22, height:22}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.inputStoryLbl
			,style:'commLbl'
			,rect:{left:10, top:40, width:40, height:25}
		}
		,{
			type:'input'
			,name:'storyContent'
			,style:'commInput'
			,rect:{left:50, top:40, width:630, height:25}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.storyPointsLbl
			,style:'commLbl'
			,rect:{left:10, top:90, width:40, height:25}
		}
		,{
			type:'number_input'
			,name:'storyPointsContent'
			,style:'commInput'
			,text:'0'
			,rect:{left:50, top:90, width:50, height:25}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.storyOwnerLbl
			,style:'commLbl'
			,rect:{left:150, top:90, width:50, height:25}
		}
		,{
			type:'input'
			,name:'storyOwner'
			,style:'commInput'
			,text:'--'
			,querypanel:true
			,rect:{left:200, top:90, width:160, height:25}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.storyStateLbl
			,style:'commLbl'
			,rect:{left:10, top:140, width:40, height:25}
		}
		,{
			type:'drop_list'
			,name:'storyState'
			,style:'commLbl'
			,rect:{left:50, top:136, width:70, height:25}
			,listSize:{width:70, height:50}
			,listItemsData:{
				dataTempl:[{path:'item.stateLbl', dataType:'text'},{path:'item.stateImg', dataType:'style'}]
				,datas:[{text:string_res.StoryEditDlg.states[0], style:'storyWaitingState'}
				,{text:string_res.StoryEditDlg.states[1], style:'storyRuningState'}
				,{text:string_res.StoryEditDlg.states[2], style:'storyFinishedState'}
				,{text:string_res.StoryEditDlg.states[3], style:'storyErrorState'}
				]
			}
			,itemTempl:{
				type:'widget'
				,name:'item'
				,style:'item'
				,hotstyle:'item-hot'
				,duplicate:true
				,size:{cx:70, cy:25}
				,items:[
					{
						type:'label'
						,name:'stateLbl'
						,style:'commLbl'
						,rect:{left:2, top:4, width:40, height:20}
					}
					,{
						type:'widget'
						,name:'stateImg'
						,style:'commLbl'
						,rect:{left:40, top:4, width:14, height:14}
					}
				]
			}
		}
					
		
		,{
			type:'check'
			,style:'bindWithTestCase'
			,name:'bindWithTestCase'
			,text:string_res.StoryEditDlg.bindCase
			,rect:{left:50+100, top:135, width:200, height:25}
		}
		,{
			type:'button'
			,name:'confirmButton'
			,style:'commButton'
			,text:string_res.btn.confirm
			,rect:{left:450, top:190, width:80, height:25}
		}
		,{
			type:'button'
			,name:'cancelButton'
			,style:'commButton'
			,text:string_res.btn.cancel
			,rect:{left:550, top:190, width:80, height:25}
		}
		/*------------------------*/
		,{
			type:'label'
			,text:string_res.StoryEditDlg.testcaseLbl
			,style:'commLbl'
			,rect:{left:10, top:325-90, width:200, height:25}
		}
		,{
			type:'button'
			,name:'addCaseBtn'
			,style:'commButton'
			,text:string_res.StoryEditDlg.addNewCase
			,rect:{left:70, top:322-90, width:60, height:20}
		}
		
		/* test case pass total info */
		,{
			type:'widget'
			,name:'passInfo'
			,style:'commLbl'
			,rect:{left:70+150, top:322-90, width:80, height:20}
			,items:[
				{
					type:'widget'
					,style:'casePassState'
					,rect:{left:2, top:2, width:14, height:14}
				}
				,{
					type:'label'
					,style:'commLbl'
					,name:'total'
					,text:'0'
					,rect:{left:2+18, top:2, width:50, height:14}
				}
			]
		}
		/* test case no pass total info */
		,{
			type:'widget'
			,name:'unpassInfo'
			,style:'commLbl'
			,rect:{left:70+150 + 80, top:322-90, width:80, height:20}
			,items:[
				{
					type:'widget'
					,style:'caseNopassState'
					,rect:{left:2, top:2, width:14, height:14}
				}
				,{
					type:'label'
					,style:'commLbl'
					,name:'total'
					,text:'0'
					,rect:{left:2+18, top:2, width:50, height:14}
				}
			]
		}
		
		/* test case list head */
		,{
			type:'label'
			,text:string_res.StoryEditDlg.caseNameLbl
			,style:'commHeadLbl'
			,rect:{left:20-1, top:325-90+25, width:440, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.caseOwnerLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+440, top:325-90+25, width:100, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.caseStateLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+440+100, top:325-90+25, width:55, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.caseOpLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+440+100+55, top:325-90+25, width:67, height:20}
		}
		
		/* test case list */
		,{
			type:'list'
			,name:'testcaseList'
			,style:'testcaseList'
			,rect:{left:20, top:345 - 63, width:660, height:130}
			,canDrag:true
			,itemTempl:{
				type:'widget'
				,name:'item'
				,style:'item'
				,hotstyle:'item-hot'
				,duplicate:true
				,size:{cx:660, cy:28}
				,items:[
					{
						type:'edit_label'
						,name:'name'
						,style:'caseName'
						,labelStyle:'caseLabelName'
						,editBtnStyle:'edit_float_icon'
						,undoBtnStyle:'undo_icon'
						,inputStyle:'caseInput'
						,rect:{left:2, top:6, width:440, height:20}
					}
					,{
						type:'edit_label'
						,name:'owner'
						,querypanel:true
						,style:'caseName'
						,labelStyle:'caseLabelName'
						,editBtnStyle:'edit_float_icon'
						,undoBtnStyle:'undo_icon'
						,inputStyle:'caseInput'
						,rect:{left:2+440+4, top:6, width:100-8, height:20}
					}
					,{
						type:'drop_list'
						,name:'state'
						,style:'commLbl'
						,rect:{left:2+440+4+100-5, top:2, width:55, height:25}
						,listSize:{width:60, height:50}
						,listItemsData:{
							dataTempl:[{path:'item.stateLbl', dataType:'text'},{path:'item.stateImg', dataType:'style'}]
							,datas:[{text:string_res.StoryEditDlg.caseFail, style:'caseNopassState'},{text:string_res.StoryEditDlg.casePass, style:'casePassState'}]
						}
						,itemTempl:{
							type:'widget'
							,name:'item'
							,style:'item'
							,hotstyle:'item-hot'
							,duplicate:true
							,size:{cx:60, cy:25}
							,items:[
								{
									type:'label'
									,name:'stateLbl'
									,style:'commLbl'
									,rect:{left:2, top:4, width:28, height:20}
								}
								,{
									type:'widget'
									,name:'stateImg'
									,style:'commLbl'
									,rect:{left:29, top:4, width:14, height:14}
								}
							]
						}
					}
					,{
						type:'image_button'
						,name:'delete'
						,style:'delete_icon'
						,hide:true
						,rect:{left:2+440+4+100-5+55+5, top:6, width:16, height:16}
					}
					,{
						type:'image_button'
						,name:'auto'
						,style:'unrelation_lock_icon'
						,hide:true
						,rect:{left:2+440+4+100-5+55+5+20, top:6, width:16, height:16}
					}
				]
			}
		}
		
		/*task panel*/
		,{
			type:'label'
			,text:string_res.StoryEditDlg.taskLbl
			,style:'commLbl'
			,rect:{left:10, top:495 - 50, width:200, height:25}
		}
		,{
			type:'button'
			,name:'addTaskBtn'
			,style:'commButton'
			,text:string_res.StoryEditDlg.addNewTask
			,rect:{left:70, top:492 - 50, width:60, height:20}
		}
		,{
			type:'check_button'
			,name:'toggleTaskPanelBtn'
			,style:'to_expand_icon'
			,hotStyle:'to_expand_icon'
			,pressStyle:'to_collapse_icon'
			,pressHotStyle:'to_collapse_icon'
			,tip:string_res.StoryEditDlg.tip.toggleTaskPanel
			,rect:{left:70+150 + 80 + 300 + 65 , top:492 - 50 - 20, width:16, height:16}
		}

		/* task list head */
		,{
			type:'label'
			,text:string_res.StoryEditDlg.taskNameLbl
			,style:'commHeadLbl'
			,rect:{left:20-1, top:325-90+25+210, width:400-15, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.taskLeftTimeLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+400-15, top:325-90+25+210, width:60, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.taskOwnerLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+440+20-15, top:325-90+25+210, width:100, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.taskStateLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+440+100+20-15, top:325-90+25+210, width:55+15, height:20}
		}
		,{
			type:'label'
			,text:string_res.StoryEditDlg.taskOpLbl
			,style:'commHeadLbl'
			,rect:{left:20-1+440+100+55+20, top:325-90+25+210, width:47, height:20}
		}

		,{
			type:'list'
			,name:'taskList'
			,style:'taskList'
			,rect:{left:20, top:515-23, width:660, height:130}
			,canDrag:true
			,itemTempl:{
				type:'widget'
				,name:'item'
				,style:'item'
				,hotstyle:'item-hot'
				,duplicate:true
				,size:{cx:660, cy:28}
				,items:[
					{
						type:'edit_label'
						,name:'name'
						,style:'taskName'
						,labelStyle:'taskLabelName'
						,editBtnStyle:'edit_float_icon'
						,undoBtnStyle:'undo_icon'
						,inputStyle:'taskInput'
						,rect:{left:2, top:6, width:400-15, height:20}
					}
					,{
						type:'edit_number_label'
						,name:'leftTime'
						,querypanel:true
						,style:'taskName'
						,labelStyle:'taskLabelName'
						,editBtnStyle:'edit_float_icon'
						,undoBtnStyle:'undo_icon'
						,inputStyle:'taskInput'
						,rect:{left:2+400+4-15, top:6, width:60-8, height:20}
					}
					,{
						type:'edit_label'
						,name:'owner'
						,querypanel:true
						,style:'taskName'
						,labelStyle:'taskLabelName'
						,editBtnStyle:'edit_float_icon'
						,undoBtnStyle:'undo_icon'
						,inputStyle:'taskInput'
						,rect:{left:2+440+20+4-15, top:6, width:100-8, height:20}
					}
					,{
						type:'drop_list'
						,name:'state'
						,style:'commLbl'
						,rect:{left:2+440+4+20+100-5-15, top:2, width:70, height:25}
						,listSize:{width:70, height:50}
						,listItemsData:{
							dataTempl:[{path:'item.stateLbl', dataType:'text'},{path:'item.stateImg', dataType:'style'}]
							,datas:[{text:string_res.StoryEditDlg.states[0], style:'storyWaitingState'}
							,{text:string_res.StoryEditDlg.states[1], style:'storyRuningState'}
							,{text:string_res.StoryEditDlg.states[2], style:'storyFinishedState'}
							]
						}
						,itemTempl:{
							type:'widget'
							,name:'item'
							,style:'item'
							,hotstyle:'item-hot'
							,duplicate:true
							,size:{cx:70, cy:25}
							,items:[
								{
									type:'label'
									,name:'stateLbl'
									,style:'commLbl'
									,rect:{left:2, top:4, width:40, height:20}
								}
								,{
									type:'widget'
									,name:'stateImg'
									,style:'commLbl'
									,rect:{left:40, top:4, width:14, height:14}
								}
							]
						}						
					}
					,{
						type:'image_button'
						,name:'delete'
						,style:'delete_icon'
						,hide:true
						,rect:{left:2+440+4+20+100-5+55+5, top:6, width:16, height:16}
					}
				]
			}
		}
	]
};
	
ui_res.caseDlg = {
	type:'widget'
	,modal: true
	,name: 'root'
	,dragTitle: 40
	,style:'dialog caseDlg'
	,escape:true
	,rect:{left:2, top:0, width:990, height:900}
	,items:[
		{
			type:'label'
			,text: string_res.CaseDlg.title
			,name:'title'
			,style:'dlgTitle'
			,rect:{left:0, top:0, width:990, height:35}
		}
		,{
			type:'image_button'
			,name:'closeBtn'
			,style:'dlgclose_icon'
			,rect:{left:960, top:7, width:22, height:22}
		}
		,{
			type:'button'
			,name:'editBtn'
			,style:'commButton case_btn_toporder'
			,text:string_res.btn.edit
			,rect:{left:10, top:45, width:60, height:23}
		}
		,{
			type:'button'
			,name:'deleteBtn'
			,style:'commButton case_btn_toporder'
			,text:string_res.btn.deleteBtn
			,rect:{left:10+65, top:45, width:60, height:23}
		}
		
		,{
			type:'button'
			,name:'saveBtn'
			,style:'commButton'
			,text:string_res.btn.save
			,rect:{left:10+65+65, top:45, width:60, height:23}
		}
		,{
			type:'button'
			,name:'cancelBtn'
			,style:'commButton'
			,text:string_res.btn.cancel
			,rect:{left:10+65+65+65, top:45, width:60, height:23}
		}
		
		/* test case pass total info */
		,{
			type:'widget'
			,name:'passInfo'
			,style:'commLbl'
			,rect:{left:700, top:47, width:80, height:20}
			,items:[
				{
					type:'widget'
					,style:'casePassState'
					,rect:{left:2, top:2, width:14, height:14}
				}
				,{
					type:'label'
					,style:'commLbl'
					,name:'total'
					,text:'0'
					,rect:{left:2+18, top:2, width:50, height:14}
				}
			]
		}
		/* test case no pass total info */
		,{
			type:'widget'
			,name:'unpassInfo'
			,style:'commLbl'
			,rect:{left:700+80, top:47, width:80, height:20}
			,items:[
				{
					type:'widget'
					,style:'caseNopassState'
					,rect:{left:2, top:2, width:14, height:14}
				}
				,{
					type:'label'
					,style:'commLbl'
					,name:'total'
					,text:'0'
					,rect:{left:2+18, top:2, width:50, height:14}
				}
			]
		}		
		
		,{
			type:'button'
			,name:'runBtn'
			,style:'commButton'
			,text:string_res.btn.run
			,rect:{left:10+860, top:45, width:60, height:23}
		}
		,{
			type:'image_button'
			,name:'helpBtn'
			,style:'help_icon'
			,rect:{left:950, top:50, width:16, height:16}
		}
		,{
			type:'minput'
			,name:'editor'
			,style:'editor'
			,rect:{left:10, top:75, width:970, height:400}
		}
		,{
			type:'widget'
			,name:'border'
			,style:'preview_border'
			,rect:{left:10, top:75+410, width:970-2, height:400}
			,items:[
				{
					type:'rich_label'
					,name:'preview'
					,style:'case_content preview'
					,rect:{left:10, top:10, width:970-20, height:400-20}
				}
			]
		}
	]
};

ui_res.caseHelpDlg = {
	type:'widget'
	,modal: true
	,name: 'root'
	,dragTitle: 40
	,style:'dialog'
	,escape:true
	,rect:{left:100, top:50, width:600, height:500}
	,items:[
		{
			type:'label'
			,text: string_res.CaseHelpDlg.title
			,name:'title'
			,style:'dlgTitle'
			,rect:{left:0, top:0, width:600, height:35}
		}
		,{
			type:'image_button'
			,name:'closeBtn'
			,style:'dlgclose_icon'
			,rect:{left:560, top:7, width:22, height:22}
		}
		,{
			type:'label'
			,text: string_res.CaseHelpDlg.helpContent
			,style:'commLbl commScroll'
			,rect:{left:10, top:45, width:580, height:430}
		}
	]
};

ui_res.allStoryListItemTempl = {
	type:'widget'
	,name:'item'
	,style:'item'
	,hotstyle:'item-hot'
	,size:{cx:990-16-16, cy:70-20}
	,duplicate:true
	,items:[
		{
			type:'edit_label'
			,name:'story'
			,style:'story'
			,labelStyle:'storyLbl'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'storyInput'
			,rect:{left:10, top:10, width:760+80-16-16, height:35}
		}
		,{
			type:'widget'
			,name:'toolbar'
			,style:'toolbar'
			,rect:{left:800+80-16-16, top:1, width:90, height:18}
			,items:[
				{
					type:'image_button'
					,name:'editButton'
					,style:'edit_detail_icon'
					,tip:string_res.btn.edit
					,pos:{x:10, y:0}
				}
				,{
					type:'image_button'
					,name:'insertButton'
					,style:'insert_icon'
					,tip:string_res.btn.insert
					,pos:{x:40, y:0}
				}
				,{
					type:'image_button'
					,name:'deleteButton'
					,style:'delete_icon'
					,tip:string_res.btn.deleteBtn
					,pos:{x:70, y:0}
				}
			]
		}
		,{
			type:'edit_label'
			,name:'owner'
			,style:'grayLbl1'
			,labelStyle:'storyPointsText'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'storyPointsInput'
			,querypanel:true
			,rect:{left:788-110 + 40 + 80 - 16 - 16, top:47-20, width:100, height:22}
		}	
		,{
			type:'edit_number_label'
			,name:'storyPoints'
			,style:'grayLbl1'
			,labelStyle:'storyPointsText'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'storyPointsInput'
			,rect:{left:788-5 + 40 + 80 - 16 - 16, top:47-20, width:40, height:22}
		}					
		,{
			type:'drop_list'
			,name:'state'
			,style:'commLbl'
			,rect:{left:868 + 80 - 16 - 16, top:43-20, width:28, height:14}
			,listSize:{width:28, height:50}
			,listItemsData:{
				dataTempl:[{path:'item.stateImg', dataType:'style'}]
				,datas:[{style:'storyWaitingState'}
				,{style:'storyRuningState'}
				,{style:'storyFinishedState'}
				,{style:'storyErrorState'}
				]
			}
			,itemTempl:{
				type:'widget'
				,name:'item'
				,style:'item'
				,hotstyle:'item-hot'
				,duplicate:true
				,size:{cx:24, cy:25}
				,items:[
					{
						type:'widget'
						,name:'stateImg'
						,style:'commLbl'
						,rect:{left:1, top:4, width:14, height:14}
					}
				]
			}
		}
	]
};

ui_res.currentSprintTabPanel = {
	type:'widget'
	,name:'root'
	,style:'currentSprint'
	,items:[
		{
			type:'label'
			,text:string_res.CurrentSprint.sprintTime
			,style:'commLbl'
			,rect:{left:0, top:6, width:90, height:20}
		}
		,{
			type:'edit_label'
			,name:'sprintStart'
			,style:'sprintTime'
			,labelStyle:'sprintTimeName'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'sprintTimeInput'
			,rect:{left:95, top:3, width:90, height:20}
		}
		,{
			type:'edit_label'
			,name:'sprintEnd'
			,style:'sprintTime'
			,labelStyle:'sprintTimeName'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'sprintTimeInput'
			,rect:{left:95+110, top:3, width:90, height:20}
		}
		,{
			type:'list'
			,name:'storyList'
			,style:'storyList'
			,rect:{left:0, top:28, width:990, height:800}
			,canDrag:true
			,itemTempl:ui_res.allStoryListItemTempl
		}
	]
};

ui_res.allSprintsTabPanel = {
	type:'widget'
	,name:'root'
	,style:'currentSprint'
	,items:[
		{
			type:'button'
			,name:'createSprint'
			,text:string_res.AllSprintsTabPanel.createSprintBtn
			,rect:{left:0, top:3, width:90, height:20}
		}
		
		,{
			type:'list'
			,name:'sprintList'
			,style:'commBorder commScroll'
			,rect:{left:0, top:28, width:990, height:800}
			,canDrag:true
			,itemTempl:{	type:'widget'
				,name:'item'
				,style:'item'
				,hotstyle:'item-hot'
				,size:{cx:990, cy:70}
				,duplicate:true
				,items:[
					{
						type:'edit_label'
						,name:'name'
						,style:'story'
						,labelStyle:'storyLbl'
						,editBtnStyle:'edit_float_icon'
						,undoBtnStyle:'undo_icon'
						,inputStyle:'storyInput'
						,rect:{left:10, top:10, width:760+80, height:35}
					}
				]
			}
		}
	]
};

ui_res.continuousIntegrationTabPanel = {
	type:'widget'
	,name:'root'
	,style:'currentSprint'
	,items:[
		{
			type:'label'
			,text:string_res.CurrentSprint.sprintTime
			,style:'commLbl'
			,rect:{left:0, top:6, width:90, height:20}
		}
		,{
			type:'edit_label'
			,name:'sprintStart'
			,style:'sprintTime'
			,labelStyle:'sprintTimeName'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'sprintTimeInput'
			,rect:{left:95, top:3, width:90, height:20}
		}
		,{
			type:'edit_label'
			,name:'sprintEnd'
			,style:'sprintTime'
			,labelStyle:'sprintTimeName'
			,editBtnStyle:'edit_float_icon'
			,undoBtnStyle:'undo_icon'
			,inputStyle:'sprintTimeInput'
			,rect:{left:95+110, top:3, width:90, height:20}
		}
	]
};

ui_res.allStoryListTabPanel = {
	type:'widget'
	,name:'root'
	,style:'storyListPanel'
	,items:[
		{
			type:'label'
			,text:string_res.StoryList.storyList
			,style:'commLbl'
			,rect:{left:0, top:6, width:90, height:20}
		}
		,{
			type:'button'
			,name:'addStory'
			,text:string_res.StoryList.addNewBtn
			,rect:{left:95, top:3, width:90, height:20}
		}
		,{
			type:'list'
			,name:'storyList'
			,style:'storyList'
			,rect:{left:0, top:28, width:990-16-16, height:800-400+30}
			,canDrag:true
			,itemTempl:ui_res.allStoryListItemTempl
		}
	]
};

ui_res.createSprintDlg = {
	type:'widget'
	,modal: true
	,name: 'root'
	,dragTitle: 40
	,style:'dialog storyEditDlg'
	,escape:true
	,rect:{left:200, top:200, width:500, height:400}
	,items:[
		{
			type:'label'
			,text: string_res.CreateSprintDlg.title
			,name:'title'
			,style:'dlgTitle'
			,rect:{left:0, top:0, width:500, height:35}
		}
		,{
			type:'image_button'
			,name:'closeBtn'
			,style:'dlgclose_icon'
			,rect:{left:500-30, top:7, width:22, height:22}
		}
		,{
			type:'label'
			,text:string_res.CreateSprintDlg.sprintTitleLbl
			,style:'commLbl'
			,rect:{left:10, top:45, width:70, height:25}
		}
		,{
			type:'input'
			,name:'sprintTitle'
			,style:'commInput'
			,rect:{left:70+10, top:40, width:400, height:25}
		}
		,{
			type:'label'
			,text:string_res.CreateSprintDlg.sprintConLbl
			,style:'commLbl'
			,rect:{left:10, top:90, width:70, height:25}
		}
		,{
			type:'minput'
			,name:'sprintCon'
			,style:'commInput'
			,rect:{left:70+10, top:90, width:400, height:200}
		}
		,{
			type:'label'
			,text:string_res.CreateSprintDlg.sprintTimeLbl
			,style:'commLbl'
			,rect:{left:10, top:90 + 200 + 10+3, width:70, height:25}
		}
		,{
			type:'label'
			,text:string_res.CreateSprintDlg.sprintStartTimeLbl
			,style:'commLbl'
			,rect:{left:10+105, top:90 + 200 + 10+3, width:70, height:25}
		}
		,{
			type:'input'
			,name:'sprintStart'
			,style:'commInput'
			,rect:{left:10+95+70, top:90 + 200 + 10, width:90, height:20}
		}
		,{
			type:'label'
			,text:string_res.CreateSprintDlg.sprintEndTimeLbl
			,style:'commLbl'
			,rect:{left:10+95+70 + 90 + 15, top:90 + 200 + 10+3, width:70, height:25}
		}
		,{
			type:'input'
			,name:'sprintEnd'
			,style:'commInput'
			,rect:{left:10+95+70 + 90 + 75, top:90 + 200 + 10, width:90, height:20}
		}
		
		,{
			type:'button'
			,name:'confirmButton'
			,style:'commButton'
			,text:string_res.btn.confirm
			,rect:{left:250, top:90 + 200 + 10 + 55, width:80, height:25}
		}
		,{
			type:'button'
			,name:'cancelButton'
			,style:'commButton'
			,text:string_res.btn.cancel
			,rect:{left:350, top:90 + 200 + 10 + 55, width:80, height:25}
		}
	]
} ;

ui_res.mainTabs = {
	type:'tabctrl'
	,name:'main'
	,style:'commContainer'
	,rect:{left:10, top:10, width:990+2-16-16, height:900-400}
	,tabBtnTempl:{
		type:'check_button'
		,size:{cx:120, cy:24}
	}
	,tabBarTempl:{
		type:'widget'
		,style:'commTabsBtnBar'
		,rect:{left:0, top:0, width:990+2-16-16, height:25}
	}
	,panelContainerTempl:{
		type:'widget'
		,name:'container'
		,style:'commTabContainer'
		,rect:{left:0, top:30, width:990+2-16-16, height:900-30-400}
	}
	,tabs:[
		{tabText:string_res.mainTabs.backLog, panelTempl:ui_res.allStoryListTabPanel}
		//,{tabText:string_res.mainTabs.currentSprint, panelTempl:ui_res.currentSprintTabPanel}
		//,{tabText:string_res.mainTabs.allSprints, panelTempl:ui_res.allSprintsTabPanel}
		//,{tabText:string_res.mainTabs.continuousIntegration, panelTempl:ui_res.continuousIntegrationTabPanel}
	]
};

