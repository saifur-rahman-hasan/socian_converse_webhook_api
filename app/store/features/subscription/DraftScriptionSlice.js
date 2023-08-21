import { createSlice } from '@reduxjs/toolkit'
import collect from "collect.js";

const INVOICE_DEFAULT_STATE = {
	line_items: [],
	sub_total_amount: 0,
	vat_amount: 0,
	discount_amount: 0,
	net_amount: 0
}

const initialState = {
	active: false,
	data: null,
	invoice: INVOICE_DEFAULT_STATE
}

export const DraftSubscriptionSlice = createSlice({
	name: 'draft_subscription',
	initialState,
	reducers: {
		addDraftSubscription: (state, action) => {
			state.active = true
			state.data = {
				frequency: action.payload?.frequency,
				tier: action?.payload?.tier
			}

			state.invoice = action?.payload?.invoice
		},
		updateDraftSubscriptionTier: (state, action) => {
			state.active = true
			state.data.tier = action.payload?.tier
		},
		destroyDraftSubscription: (state) => {
			state.active = false
			state.data = null
			state.invoice = INVOICE_DEFAULT_STATE
		},
		updateInvoiceLineItems: (state, action) => {
			const stateLineItems = state.invoice?.line_items

			if(stateLineItems?.length > 0){
				state.invoice.line_items = stateLineItems.map(item => {
					return item.id === action.payload.id
						? action.payload
						: item
				})
			}else{
				state.invoice.line_items.push(action.payload)
			}
		},
		calculateInvoice: (state, action) => {
			const subtotal_amount = collect(state.invoice?.line_items).sum("amount")
			const tax_amount = action?.payload?.tax_amount || 0
			const discount_amount = action?.pass?.discount_amount || 0
			const net_amount = (subtotal_amount + tax_amount) - discount_amount

			state.invoice = {
				...state.invoice,
				subtotal_amount: subtotal_amount,
				tax_amount: tax_amount,
				discount_amount: discount_amount,
				net_amount: net_amount
			}
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	addDraftSubscription,
	updateDraftSubscriptionTier,
	destroyDraftSubscription,
	updateInvoiceLineItems,
	calculateInvoice
} = DraftSubscriptionSlice.actions

export default DraftSubscriptionSlice.reducer