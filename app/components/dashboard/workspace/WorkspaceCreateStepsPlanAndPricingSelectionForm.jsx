import {useState} from 'react'
import { RadioGroup } from '@headlessui/react'
import classNames from "@/utils/classNames";
import {useDispatch} from "react-redux";
import {updateWorkspaceCreateActiveStep} from "@/store/features/workspace/WorkspaceSlice";
import {
	useGetDraftWorkspaceQuery,
	useUpdateDraftWorkspaceMutation
} from "@/store/features/workspace/WorkspaceAPISlice";
import {useGetPricingPlansQuery} from "@/store/features/pricingPlan/PricingPlanAPISlice";
import Dump from "../../Dump";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import {useRouter} from "next/router";

const frequencies = [
	{ value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
	{ value: 'annually', label: 'Annually', priceSuffix: '/year' },
]

const plans = [
	{ id: 1, name: 'Startup', priceMonthly: 29, priceYearly: 290, limit: 'Up to 5 active job postings' },
	{ id: 2, name: 'Business', priceMonthly: 99, priceYearly: 990, limit: 'Up to 25 active job postings' },
	{ id: 3, name: 'Enterprise', priceMonthly: 249, priceYearly: 2490, limit: 'Unlimited active job postings' },
]

export default function WorkspaceCreateStepsPlanAndPricingSelectionForm() {
	const router = useRouter()
	const [selected, setSelected] = useState(plans[0])

	// const {
	// 	data: pricingPlans,
	// 	isLoading: pricingPlanIsLoading,
	// 	error: pricingPlanFetchError
	// } = useGetPricingPlansQuery()

	const {
		data: draftWorkspaceData,
		isLoading: draftWorkspaceIsLoading,
		error: draftWorkspaceFetchError,
		refetch: refetchDraftWorkspace
	} = useGetDraftWorkspaceQuery()

	const [ updateDraftWorkspace, {
		isLoading: draftWorkspaceIsUpdating,
		error: draftWorkspaceUpdateError
	}] = useUpdateDraftWorkspaceMutation();

	const dispatch = useDispatch()


	async function handleSelectedPlanSubmit(e) {
		e.preventDefault()

		if(!draftWorkspaceData?.id){
			alert('Draft Workspace Not found.')
			return false
		}

		const confirmPayment = confirm('Are you sure to confirm payment?')
		if(!confirmPayment){ return false }

		const updatedDraftWorkspace = await updateDraftWorkspace({
			id: draftWorkspaceData.id,
			subscription: {
				id: 1,
				workspaceId: draftWorkspaceData.id,
				plan: selected,
				paymentConfirmed: true,
				active: true
			}
		})

		if(
			updatedDraftWorkspace?.data?.id &&
			updatedDraftWorkspace?.data?.subscription?.active === true
		){

			await refetchDraftWorkspace()

			await dispatch(updateWorkspaceCreateActiveStep({
				current_step_status: 'complete',
				next_active_step: 'team'
			}))

			await router.push({
				pathname: `/workspaces/create`,
				query: {
					step: 'team'
				}
			})
		}
	}

	return (
		<div className="bg-white pt-10 rounded-md shadow">
			<form onSubmit={handleSelectedPlanSubmit}>
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<h4 className="text-3xl font-bold tracking-tight text-gray-900">
							Pricing plans for teams of all sizes
						</h4>
					</div>

					{ draftWorkspaceIsLoading && (<DefaultSkeleton />) }

					{ !draftWorkspaceIsLoading && draftWorkspaceFetchError && (<Dump data={{draftWorkspaceFetchError}} /> ) }

					{ !draftWorkspaceIsLoading && !draftWorkspaceFetchError && draftWorkspaceData && (
						<div className={`my-10`}>
							<RadioGroup value={selected} onChange={setSelected}>
								<RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
								<div className="relative -space-y-px rounded-md bg-white">
									{plans.map((plan, planIdx) => (
										<RadioGroup.Option
											key={plan.name}
											value={plan}
											className={({ checked }) =>
												classNames(
													planIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
													planIdx === plans.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
													checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200',
													'relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6'
												)
											}
										>
											{({ active, checked }) => (
												<>
												<span className="flex items-center text-sm">
									                <span
										                className={classNames(
											                checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
											                active ? 'ring-2 ring-offset-2 ring-indigo-600' : '',
											                'h-4 w-4 rounded-full border flex items-center justify-center'
										                )}
										                aria-hidden="true"
									                >
								                    <span className="rounded-full bg-white w-1.5 h-1.5" />
								                  </span>

									                <RadioGroup.Label
										                as="span"
										                className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3 font-medium')}
									                >
								                    {plan.name}
								                  </RadioGroup.Label>
								                </span>

													<RadioGroup.Description as="span" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
								                  <span className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'font-medium')}>
								                    ${plan.priceMonthly} / mo
								                  </span>{' '}
														<span className={checked ? 'text-indigo-700' : 'text-gray-500'}>(${plan.priceYearly} / yr)</span>
													</RadioGroup.Description>

													<RadioGroup.Description
														as="span"
														className={classNames(
															checked ? 'text-indigo-700' : 'text-gray-500',
															'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right'
														)}
													>
														{plan.limit}
													</RadioGroup.Description>
												</>
											)}
										</RadioGroup.Option>
									))}
								</div>
							</RadioGroup>
						</div>
					)}
				</div>

				<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
					{
						draftWorkspaceIsUpdating || draftWorkspaceIsLoading
							? (
								<button type="button" disabled={true} className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
									Please wait ...
								</button>
							)
							: (
								<button type="submit" className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
									Next
								</button>
							)
					}
				</div>
			</form>
		</div>
	)
}



