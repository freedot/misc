/*******************************************************************************/
Payment = Class.extern(function(){
	var m_this = null;
	var m_g = null;
	this.init = function(){
		m_this = this;
	};
	
	this.initOneTime = function(g){
		m_g = g;
	};
	
	this.pay = function(){
		fusion2.dialog.pay({ 
			zoneid : pay_zone_id
			,sandbox : true
  			,onClose : m_this._closePay
		});
		PaymentSender.sendStartPay(m_g);
	};
	
	this._closePay = function(){
		PaymentSender.sendStopPay(m_g);
	};
}).snew();



