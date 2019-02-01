/*******************************************************************************/
SwfSoundPlayer = Class.extern(function(){
	this.init = function(swf){
		this._swf = swf;
		this._src = '';
	};
	
	this.load = function(src){
		this._src = IMG.getSound(src);
	};
	
	this.play = function(){
		this._swf.playSound(this._src);
	};
	
	this.pause = function(){
		this._swf.stopSound();
	};
});

SoundMgr = Class.extern(function(){
	var m_this = null;
	var m_g = null;
	var m_sounds = {};
	var m_srcs = [];
	var m_playBackTimer = null;
	var m_curBack = {idx:0, elapse:0};
	var m_drt = 1000;
	var m_curSrc = null;
	var m_canPlayBkSound = true;
	var m_swf_play = null;
	var m_swf_playback = null;
	var m_isRand = true;
	var m_needPlay = true;
	this.init = function(){
		m_this = this;
		if ( TQ.isMobile() ) {
			m_needPlay = false;
		}
	};
	
	this.initOneTime = function(g){
		m_g = g;
	};
	
	this.playSound = function(src) {
		if ( !m_needPlay ) return;
		m_this._loadSound(src, false).play();
	};
	
	this.playBackSound = function(res){
		if ( !m_needPlay ) return;
		this.stopBackSound();
		if (res.sounds.length == 0) return;
		
		m_srcs = res.sounds;
		m_isRand = res.isRand;
		m_curBack.idx = 0xffffffff;
		m_playBackTimer = window.setInterval(this._updateBackSound, m_drt);
	};
	
	this.toggleBackSound = function(){
		if ( !m_needPlay ) return;
		m_canPlayBkSound = !m_g.getImgr().isCanPlayBackSound();
		m_g.getImgr().setCanPlayBackSound(m_canPlayBkSound);
		
		this._playCurBackSound();
		
		ClientCfgSender.sendSoundFlag(m_g);
	};
	
	this.playCurBackSound = function(){
		if ( !m_needPlay ) return;
		UIM.getPanel('main').getItems().smbtn_toggle_bgsound.setPress( !m_g.getImgr().isCanPlayBackSound() );
		this._playCurBackSound();
	};
	
	this._playCurBackSound = function(){
		m_canPlayBkSound = m_g.getImgr().isCanPlayBackSound();
		if ( m_canPlayBkSound && m_curSrc ) {
			m_this._loadSound(m_curSrc, true).play();
		} else if (m_curSrc) {
			m_this._loadSound(m_curSrc, true).pause();
		}
	};
	
	this.isCanPlayBackSound = function(){
		return m_g ? m_g.getImgr().isCanPlayBackSound() : m_canPlayBkSound;
	};
	
	this.stopBackSound = function(){
		if (m_playBackTimer) {
			window.clearInterval(m_playBackTimer);
			m_playBackTimer = null;
		}
		
		if (m_curSrc) {
			m_this._loadSound(m_curSrc, true).pause();
		}
	};
	
	this._loadSound = function(src, isback) {
		if ( TQ.isIE6() || TQ.isIE7() || TQ.isIE8() ) {
			return m_this._loadIESound(src, isback);
		}
		
		if ( !m_sounds[src] ) {
			var d = document.createElement('audio');
			d.setAttribute('src', IMG.getSound(src));
			var parent = document.getElementById('g_body');
			parent.appendChild(d);
			if (!d.play) d.play = function(){};
			if (!d.pause) d.pause = function(){};
			m_sounds[src] = d;
		}
		return m_sounds[src];		
	};	
	
	this._loadIESound = function(src, isback){
		if (!isback) {
			if ( !m_swf_play ) {
				var swf = swfobject.getObjectById("swf_play_sound_"); 
				m_swf_play = SwfSoundPlayer.snew(swf);
			}
			
			m_swf_play.load(src);
			return m_swf_play;
		} else {
			if ( !m_swf_playback ) {
				var swf = swfobject.getObjectById("swf_play_backsound_"); 
				m_swf_playback = SwfSoundPlayer.snew(swf);
			}			
			
			m_swf_playback.load(src);
			return m_swf_playback;
		}
	};
	
	this._updateBackSound = function(){
		if ( m_curBack.idx >= m_srcs.length ) {
			m_this._initBackSound(m_srcs);
			m_curBack.idx = 0;
			m_curBack.elapse = 0;
			m_curSrc = m_srcs[m_curBack.idx].src;
			if (m_canPlayBkSound) m_this._loadSound(m_srcs[m_curBack.idx].src, true).play();
			return;
		}
		
		m_curBack.elapse += m_drt;
		var src = m_srcs[m_curBack.idx];
		if ( m_curBack.elapse >= src.duration ) {
			m_curBack.elapse = 0;
			m_curBack.idx++;
			if ( m_curBack.idx >= m_srcs.length ) return;
			m_curSrc = m_srcs[m_curBack.idx].src;
			if (m_canPlayBkSound) m_this._loadSound(m_srcs[m_curBack.idx].src, true).play();
		}
	};
	
	this._initBackSound = function(srcs){
		var tsrcs = [];
		var ssrcs = [];
		TQ.dictCopy(ssrcs, srcs);
		if (!m_isRand) {
			return ssrcs;
		}
		
		while ( ssrcs.length > 0 ) {
			var randIdx = Math.floor(Math.random()*1000000) % ssrcs.length;
			var src = ssrcs[randIdx];
			ssrcs.splice(randIdx, 1);
			tsrcs.push(src);
		}
		m_srcs = tsrcs;
	};
}).snew();
