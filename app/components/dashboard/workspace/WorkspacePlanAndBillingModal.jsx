import { Fragment, useState } from 'react'
import {Dialog, Disclosure, RadioGroup, Transition} from '@headlessui/react'
import {CheckIcon, MinusSmallIcon, PlusSmallIcon, XMarkIcon} from '@heroicons/react/24/outline'
import classNames from "../../../utils/classNames";

const pricing = {
	frequencies: [
		{ value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
		{ value: 'annually', label: 'Annually', priceSuffix: '/year' },
	],
	tiers: [
		{
			name: 'Hobby',
			id: 'tier-hobby',
			href: '#',
			price: { monthly: '$15', annually: '$144' },
			description: 'The essentials to provide your best work for clients.',
			features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics'],
			mostPopular: false,
		},
		{
			name: 'Freelancer',
			id: 'tier-freelancer',
			href: '#',
			price: { monthly: '$30', annually: '$288' },
			description: 'The essentials to provide your best work for clients.',
			features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
			mostPopular: false,
		},
		{
			name: 'Startup',
			id: 'tier-startup',
			href: '#',
			price: { monthly: '$60', annually: '$576' },
			description: 'A plan that scales with your rapidly growing business.',
			features: [
				'25 products',
				'Up to 10,000 subscribers',
				'Advanced analytics',
				'24-hour support response time',
				'Marketing automations',
			],
			mostPopular: true,
		},
		{
			name: 'Enterprise',
			id: 'tier-enterprise',
			href: '#',
			price: { monthly: '$90', annually: '$864' },
			description: 'Dedicated support and infrastructure for your company.',
			features: [
				'Unlimited products',
				'Unlimited subscribers',
				'Advanced analytics',
				'1-hour, dedicated support response time',
				'Marketing automations',
				'Custom reporting tools',
			],
			mostPopular: false,
		},
	],
}
const faqs = [
	{
		question: "What's the best thing about Switzerland?",
		answer:
			"I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	// More questions...
]

export default function WorkspacePlanAndBillingModal() {
	const [open, setOpen] = useState(true)
	const [frequency, setFrequency] = useState(pricing.frequencies[0])

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto bg-white py-10">
					<div className="min-h-full">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all min-w-full min-h-screen">

								<button className={`absolute right-14 text-gray-500`} onClick={() => setOpen(false)}>
									<XMarkIcon className={`w-8 h-8`} />
								</button>

								<div>
									<div id={`plan_and_pricing_section`}>
										{/* Pricing section */}
										<div className="mx-auto mt-16 w-full px-6 sm:mt-32 lg:px-8">
											<div className="mx-auto w-full text-center">
												<h1 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h1>
												<p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
													Pricing plans for teams of&nbsp;all&nbsp;sizes
												</p>
											</div>
											<p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
												Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
												loyalty, and driving sales.
											</p>
											<div className="mt-16 flex justify-center">
												<RadioGroup
													value={frequency}
													onChange={setFrequency}
													className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
												>
													<RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
													{pricing.frequencies.map((option) => (
														<RadioGroup.Option
															key={option.value}
															value={option}
															className={({ checked }) =>
																classNames(
																	checked ? 'bg-indigo-600 text-white' : 'text-gray-500',
																	'cursor-pointer rounded-full py-1 px-2.5'
																)
															}
														>
															<span>{option.label}</span>
														</RadioGroup.Option>
													))}
												</RadioGroup>
											</div>
											<div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
												{pricing.tiers.map((tier) => (
													<div
														key={tier.id}
														className={classNames(
															tier.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
															'rounded-3xl p-8'
														)}
													>
														<h2
															id={tier.id}
															className={classNames(
																tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
																'text-lg font-semibold leading-8'
															)}
														>
															{tier.name}
														</h2>
														<p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
														<p className="mt-6 flex items-baseline gap-x-1">
															<span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]}</span>
															<span className="text-sm font-semibold leading-6 text-gray-600">{frequency.priceSuffix}</span>
														</p>
														<a
															href={tier.href}
															aria-describedby={tier.id}
															className={classNames(
																tier.mostPopular
																	? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
																	: 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
																'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
															)}
														>
															Buy plan
														</a>
														<ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
															{tier.features.map((feature) => (
																<li key={feature} className="flex gap-x-3">
																	<CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
																	{feature}
																</li>
															))}
														</ul>
													</div>
												))}
											</div>
										</div>

										{/* Logo cloud */}
										<div className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 lg:px-8">
											<div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
												<img
													className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
													src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
													alt="Transistor"
													width={158}
													height={48}
												/>
												<img
													className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
													src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
													alt="Reform"
													width={158}
													height={48}
												/>
												<img
													className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
													src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
													alt="Tuple"
													width={158}
													height={48}
												/>
												<img
													className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
													src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
													alt="SavvyCal"
													width={158}
													height={48}
												/>
												<img
													className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
													src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
													alt="Statamic"
													width={158}
													height={48}
												/>
											</div>
											<div className="mt-16 flex justify-center">
												<p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5">
              <span className="hidden md:inline">
                Transistor saves up to $40,000 per year, per employee by working with us.
              </span>
													<a href="#" className="font-semibold text-indigo-600">
														<span className="absolute inset-0" aria-hidden="true" /> See our case study{' '}
														<span aria-hidden="true">&rarr;</span>
													</a>
												</p>
											</div>
										</div>

										{/* Testimonial section */}
										<div className="mx-auto mt-24 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
											<div className="relative overflow-hidden bg-gray-900 py-20 px-6 shadow-xl sm:rounded-3xl sm:py-24 sm:px-10 md:px-12 lg:px-20">
												<img
													className="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0"
													src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
													alt=""
												/>
												<div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
												<svg
													viewBox="0 0 1097 845"
													aria-hidden="true"
													className="absolute -top-56 -left-80 w-[68.5625rem] transform-gpu blur-3xl"
												>
													<path
														fill="url(#68eb76c4-2bc9-4928-860e-70adf05719f4)"
														fillOpacity=".45"
														d="M301.174 646.641 193.541 844.786 0 546.172l301.174 100.469 193.845-356.855c1.241 164.891 42.802 431.935 199.124 180.978 195.402-313.696 143.295-588.18 284.729-419.266 113.148 135.13 124.068 367.989 115.378 467.527L811.753 372.553l20.102 451.119-530.681-177.031Z"
													/>
													<defs>
														<linearGradient
															id="68eb76c4-2bc9-4928-860e-70adf05719f4"
															x1="1097.04"
															x2="-141.165"
															y1=".22"
															y2="363.075"
															gradientUnits="userSpaceOnUse"
														>
															<stop stopColor="#776FFF" />
															<stop offset={1} stopColor="#FF4694" />
														</linearGradient>
													</defs>
												</svg>
												<svg
													viewBox="0 0 1097 845"
													aria-hidden="true"
													className="hidden md:absolute md:bottom-16 md:left-[50rem] md:block md:w-[68.5625rem] md:transform-gpu md:blur-3xl"
												>
													<path
														fill="url(#68eb76c4-2bc9-4928-860e-70adf05719f4)"
														fillOpacity=".25"
														d="M301.174 646.641 193.541 844.786 0 546.172l301.174 100.469 193.845-356.855c1.241 164.891 42.802 431.935 199.124 180.978 195.402-313.696 143.295-588.18 284.729-419.266 113.148 135.13 124.068 367.989 115.378 467.527L811.753 372.553l20.102 451.119-530.681-177.031Z"
													/>
												</svg>
												<div className="relative mx-auto max-w-2xl lg:mx-0">
													<img className="h-12 w-auto" src="https://tailwindui.com/img/logos/workcation-logo-white.svg" alt="" />
													<figure>
														<blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
															<p>
																“Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente
																alias molestiae. Numquam corrupti in laborum sed rerum et corporis.”
															</p>
														</blockquote>
														<figcaption className="mt-6 text-base text-white">
															<div className="font-semibold">Judith Black</div>
															<div className="mt-1">CEO of Workcation</div>
														</figcaption>
													</figure>
												</div>
											</div>
										</div>

										{/* FAQ section */}
										<div className="mx-auto my-24 max-w-7xl px-6 sm:my-56 lg:px-8">
											<div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
												<h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
												<dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
													{faqs.map((faq) => (
														<Disclosure as="div" key={faq.question} className="pt-6">
															{({ open }) => (
																<>
																	<dt>
																		<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
																			<span className="text-base font-semibold leading-7">{faq.question}</span>
																			<span className="ml-6 flex h-7 items-center">
                            {open ? (
	                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
	                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
																		</Disclosure.Button>
																	</dt>
																	<Disclosure.Panel as="dd" className="mt-2 pr-12">
																		<p className="text-base leading-7 text-gray-600">{faq.answer}</p>
																	</Disclosure.Panel>
																</>
															)}
														</Disclosure>
													))}
												</dl>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-5 sm:mt-6">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
										onClick={() => setOpen(false)}
									>
										Go back to dashboard
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
