// Copyright (c) 2025, kowsalya and contributors
// For license information, please see license.txt

frappe.ui.form.on("Support Ticket", {

	before_workflow_action:function(frm) {
        var action = frm.selected_workflow_action
        console.log(action)
        if(action && action.toLowerCase() == 'submit'){
            frappe.validated = false
            let d = new frappe.ui.Dialog({
                title : "Support Ticket Confirmation",
                fields : [
                    {
						label: __("Issue Title"),
						fieldname: "issue_title",
						fieldtype: "Data",
						default: frm.doc.issue_title,
						read_only: 1,
					},
                    {
						label: __("Ticket Type"),
						fieldname: "ticket_type",
						fieldtype: "Data",
						default: frm.doc.ticket_type,
						read_only: 1,
					},
                    {
						label: __("Priority Level"),
						fieldname: "priority_level",
						fieldtype: "Data",
						default: frm.doc.priority_level,
						read_only: 1,
					},
                    {
						label: __("Total Estimated Time"),
						fieldname: "total_estimated_time",
						fieldtype: "Data",
						default: frm.doc.total_estimated_time,
						read_only: 1,
					},
                    {
						label: __("Total Cost Estimate"),
						fieldname: "total_cost_estimate",
						fieldtype: "Data",
						default: frm.doc.total_cost_estimate,
						
					},
                ],
                primary_action_label: "Confirm ",
				primary_action(values) {
					frm.set_value("total_cost_estimate", values.total_cost_estimate);
					frm.save()
					d.hide();
				},
				secondary_action_label: "Edit ",
				secondary_action() {
					frm.set_value("workflow_state", "Draft");
					frm.set_value("status", "Draft");
					frm.save();

					d.hide();
				},
            })
            d.show();
            return false
        }
	},
});


frappe.ui.form.on("Support Task Table", {
	time_estimate:function(frm,cdn,cdt) {
        calc(frm,cdn,cdt)
        total(frm)
	},
	hourly_rate:function(frm,cdn,cdt) {
        calc(frm,cdn,cdt)
        total(frm)
	},
    support_details_add:function(frm){
        total(frm)
    },
    support_details_remove:function(frm){
        total(frm)
    }
    
});
function calc(frm,cdn,cdt){
    frm.doc.support_details.forEach((r) => {
        if(r.time_estimate && r.hourly_rate){
            let value = r.time_estimate * r.hourly_rate
            frappe.model.set_value(cdn,cdt,"cost_estimate",value)
        }
        else{
            frappe.model.set_value(cdn,cdt,"cost_estimate",0)
        }
    });
}
function total(frm){
    let total_estimated_time = 0
    let total_estimated_cost = 0
    frm.doc.support_details.forEach((r)=>{
        
        if(r.time_estimate){
            total_estimated_time += r.time_estimate || 0
        }
        if(r.cost_estimate){
            total_estimated_cost += r.cost_estimate || 0
        }

    })
    frm.set_value("total_estimated_time",total_estimated_time)
    frm.set_value("total_cost_estimate",total_estimated_cost)
}
