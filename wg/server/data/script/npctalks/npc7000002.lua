RES_NPCTALKS.n7000002={
	onDump = function(user)
	end,
}

RES_NPCTALKS.n7000002.nodes={
	{--node1
		npcid=7000001,
		say="node1",
		ops={
			{
				s="我要跳到 node2",jump=2,
			},
			{
				s="我要跳到 node3",jump=3,
			},
			{
				s="我要跳到 node4",jump=4,
			},
			{
				s="退出"
			},
		}
	},
	{--node2
		npcid=7000001,
		say="node2",
		ops={
			{
				s="我要跳到 node1",jump=1,
			},
			{
				s="我要跳到 node3",jump=3,
			},
			{
				s="我要跳到 node4",jump=4,
			},
			{
				s="退出"
			},
		}
	},
	{--node3
		npcid=7000001,
		say="node3",
		ops={
			{
				s="我要跳到 node1",jump=1,
			},
			{
				s="我要跳到 node2",jump=2,
			},
			{
				s="我要跳到 node4",jump=4,
			},
			{
				s="退出"
			},
		}
	},
	{--node4
		npcid=7000001,
		say="node3",
		ops={
			{
				s="我要跳到 node1",jump=1,
			},
			{
				s="我要跳到 node2",jump=2,
			},
			{
				s="我要跳到 node3",jump=3,
			},
			{
				s="退出"
			},
		}
	}
}


