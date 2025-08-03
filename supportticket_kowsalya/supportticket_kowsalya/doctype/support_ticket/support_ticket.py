# Copyright (c) 2025, kowsalya and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SupportTicket(Document):
    
	
	def on_update(doc):
		if doc.customer_email:
			if frappe.db.get_value("Email Account", {"default_outgoing": 1}):
				recipient = doc.customer_email
				subject = f"Support Ticket Submitted {doc.name}"
				message = f"""<p> Dear {doc.customer_name},</p>
							<p> Your support ticket has been successfully submitted</p>
							<p> Ticket ID : {doc.name}</p>
							<p> Description : {doc.issue_description}</p>
							<p> Thank You </p>"""
				frappe.send_mail(
					recipients = [recipient],
					subject = subject,
					message = message,
					reference_doctype=doc.doctype,
					reference_name=doc.name

				)
			else:
				frappe.throw('Please Create the Email Account For Outgoing')

		if doc.send_notification == 1  and doc.workflow_state == "Draft":
			if frappe.db.get_value("Email Account", {"default_outgoing": 1}):
				recipient = frappe.db.get_value("User",doc.reported_by,"email")
				subject = f"Support Ticket Submitted {doc.name}"
				message = f"""<p> Dear {doc.customer_name},</p>
							<p> Your support ticket has been successfully submitted</p>
							<p> Ticket ID : {doc.name}</p>
							<p> Description : {doc.issue_description}</p>
							<p> Thank You </p>"""
				frappe.send_mail(
					recipients = [recipient],
					subject = subject,
					message = message,
					reference_doctype=doc.doctype,
					reference_name=doc.name

				)
		else:
			frappe.throw('Please Create the Email Account For Outgoing')

