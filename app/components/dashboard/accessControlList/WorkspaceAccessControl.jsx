import { Listbox, Dialog, Transition } from '@headlessui/react'
import {Fragment, useEffect, useRef, useState} from 'react'
import { AdjustmentsHorizontalIcon,CheckIcon,ChevronUpDownIcon,XCircleIcon } from "@heroicons/react/24/solid";
import {
	useCreateRoleMutation,
	useGetAllRoleQuery,
	useGetAllPermissionQuery,
	useCreateRolePermissionMutation,
	useCreatePermissionMutation,
	useDeleteRolePermissionMutation,
} from "@/store/features/accessControlList/AclAPISlice";
import Dump from '@/components/Dump';

const optionsFor = [
	{ id: 'role', title: 'Role Name' },
	{ id: 'permission', title: 'Permission Name' },
]

const people = [
	{ id: 1, name: 'Wade Cooper' },
	{ id: 2, name: 'Arlene Mccoy' },
	{ id: 3, name: 'Devon Webb' },
	{ id: 4, name: 'Tom Cook' },
	{ id: 5, name: 'Tanya Fox' },
	{ id: 6, name: 'Hellen Schmidt' },
	{ id: 7, name: 'Caroline Schultz' },
	{ id: 8, name: 'Mason Heaney' },
	{ id: 9, name: 'Claudie Smitham' },
	{ id: 10, name: 'Emil Schaefer' },
]
function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function WorkspaceAccessControl() {
	const cancelButtonRef = useRef(null)
	const [name, setName] = useState('')

	const [errorMessage, setErrorMessage] = useState('')
	const [selectedOption, setSelectedOption] = useState('role')
	const [allRoles, setAllRoles] = useState([])
	const [selectedRoleToEdit, setSelectedRoleToEdit] = useState()
	const [allPermission, setAllPermission] = useState([])

	const [open, setOpen] = useState(false)
	const [modalFor, setModalFor] = useState("add")

	const [selectedRole, setSelectedRole] = useState({})
	const [selectedPermission, setSelectedPermission] = useState({})

	const [
		createRole,
		{
			isLoading: roleCreateIsLoading,
			error: roleCreateError
		}
	] = useCreateRoleMutation();
	
	const [
		createPermission,
		{
			isLoading: permissionCreateIsLoading,
			error: permissionCreateError
		}
	] = useCreatePermissionMutation();
	
	const [
		createRolePermission,
		{
			isLoading: rolePermissionCreateIsLoading,
			error: rolePermissionCreateError
		}
	] = useCreateRolePermissionMutation();

	const {
        data: getAllRole,
        isLoading: getAllRoleIsLoading,
        error: getAllRoleFetchError
    } = useGetAllRoleQuery()
	
	const {
        data: getAllPermission,
        isLoading: getAllPermissionIsLoading,
        error: getAllPermissionFetchError
    } = useGetAllPermissionQuery()
	
	useEffect(() => {
        setAllRoles(getAllRole)
		setSelectedRole(allRoles?.length > 0 ? allRoles[0] : {})
        setAllPermission(getAllPermission)
		setSelectedPermission(allPermission?.length > 0 ? allPermission[0] : {})
    }, [getAllRole,getAllPermission])

	const handleRolePermissionAssign = async (e) => {
		e.preventDefault()
		const rolePermitionObj = {
			roleId: selectedRole?.id, 
			permissionId: selectedPermission?.id,
			actionType: "store"
		}

		const rolePermissionCreateResponse = await createRolePermission(rolePermitionObj)

		if(rolePermissionCreateResponse?.data?.success === true){
			setOpen(false)
			setErrorMessage('')
		}else if(rolePermissionCreateResponse?.error){
			setErrorMessage(rolePermissionCreateResponse?.error.data.message)
		}
	}

	const handleRolePermissionEdit = async (e) => {
		e.preventDefault()
		const dataObj = {
			name: name,
			selectedRoleToEdit:selectedRoleToEdit
		}
	}
	

	const [
		deleteRolePermission,
		{
			isLoading: deletingRole
		}
	] = useDeleteRolePermissionMutation()

	async function handleRolePermissionRevoke(permission) {

		const updatedPermissions = selectedRoleToEdit.roleHasPermissions.filter(
			(p) => p.permissionId !== permission.id
		);
	
		setSelectedRoleToEdit({
			...selectedRoleToEdit,
			roleHasPermissions: updatedPermissions,
		});
		
		const dataObj = {
			roleId:selectedRoleToEdit?.id,
            permissionId:permission?.id,
			actionType: "revoke"
		}
		const deleteResponse = await deleteRolePermission(dataObj)
	}

	const handleRolePermissionAdd = async (e) => {
		e.preventDefault()

		const dataObj = {
			name: name
		}
		let roleCreatePermissionResponse;

		if(selectedOption === "role"){
			roleCreatePermissionResponse = await createRole(dataObj)
		}else{
			roleCreatePermissionResponse = await createPermission(dataObj)
		}
		
		if(roleCreatePermissionResponse?.data?.success === true){
			setOpen(false)
			setErrorMessage('')
		}else if(roleCreatePermissionResponse?.error){
			setErrorMessage(roleCreatePermissionResponse?.error.data.message)
		}
	}

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Access Controll</h1>
					
				</div>
				<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={() => {
							setModalFor("add")
							setOpen(true)
						}}
					>
						Add New
					</button>
				</div>
				<div className="mt-4 sm:ml-2 sm:mt-0 sm:flex-none">
					<button
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={() => {
							setModalFor("select")
							setOpen(true)
						}}
					>
						Assign Permission
					</button>
				</div>
			</div>

			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
									Role
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Permissions
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">
							{allRoles?.map((acl) => (
								<tr key={acl.id}>
									<td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
										<div className="text-gray-900">{acl.name}</div>
									</td>
									<td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
										{acl?.roleHasPermissions?.map((permission) => (
											<span className="inline-flex items-center sm:ml-1 rounded-md bg-green-50 px-2 py-1 pl-2 pr-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
												{permission?.permission?.name}
											</span>
										))}
									</td>
									<td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-center text-sm font-medium sm:pr-0">
										<button
											type="button"
											className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
											onClick={() => {
												setModalFor("roleEdit")
												setSelectedRoleToEdit(acl)
												setName(acl?.name)
												setOpen(true)
											}}
										>
											Edit
										</button>
									</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
									{/* <Dump data={{allRoles}}/> */}

									{modalFor === "add" && (

										<form onSubmit={handleRolePermissionAdd}>
											<div>
												<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
													<AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
												</div>
												<div className="my-6 text-center sm:mt-5">
													<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
														Add Role/Permission
													</Dialog.Title>
												</div>
												
												<div className="mt-2">
													<div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
														<label htmlFor="name" className="block text-xs font-medium text-gray-900">
															Name
														</label>
														<input
															type="text"
															name="name"
															id="name"
															className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
															placeholder= {selectedOption === "role" ? "Ex: moderator" : "Ex: add user"}
															onChange={(e) => setName(e.target.value)}
															required
														/>
													</div>
													
													<div className={`mb-4`}>
														<fieldset className="mt-4">
															<div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
																{optionsFor.map((option) => (
																	<div key={option.id} className="flex items-center">
																		<input
																			id={option.id}
																			onChange={() => setSelectedOption(option.id)}
																			name="notification-method"
																			type="radio"
																			defaultChecked={option.id === 'role'}
																			className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
																		/>
																		<label htmlFor={option.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
																			{option.title}
																		</label>
																	</div>
																))}
															</div>
														</fieldset>

													</div>
												</div>
											</div>

											<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
												{!roleCreateIsLoading && (

													<button
														type="submit"
														className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
														disabled={roleCreateIsLoading}
													>
														{ 'Add new '+selectedOption }
													</button>
												)}
												
												{roleCreateIsLoading && (

													<button
														type="button"
														className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
														disabled={roleCreateIsLoading}
													>
														{ 'Please wait...' }
													</button>
												)}

												<button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
													onClick={() => setOpen(false)}
													ref={cancelButtonRef}
												>
													Cancel
												</button>
											</div>
										</form>
									)}
									
									{modalFor === "select" && (

										<form onSubmit={handleRolePermissionAssign}>
											<div>
												<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
													<AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
												</div>
												<div className="my-6 text-center sm:mt-5">
													<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
														Select Role Permission 
													</Dialog.Title>
													{/* <Dump data={{selectedRole,selectedPermission}}/> */}
												</div>
												
												<div className="mt-2">
													<Listbox value={selectedRole} onChange={setSelectedRole}>
														{({ open }) => (
															<>
															<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Select Role</Listbox.Label>
															<div className="relative mt-2">
																<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
																	
																	<span className="block truncate">{selectedRole.name}</span>
																	<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
																		<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
																	</span>
																</Listbox.Button>

																<Transition
																	show={open}
																	as={Fragment}
																	leave="transition ease-in duration-100"
																	leaveFrom="opacity-100"
																	leaveTo="opacity-0"
																>
																	<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																		{allRoles.map((role) => (
																			<Listbox.Option
																				key={role.id}
																				className={({ active }) =>
																					classNames(
																						active ? 'bg-indigo-600 text-white' : 'text-gray-900',
																						'relative cursor-default select-none py-2 pl-3 pr-9'
																					)
																				}
																				value={role}
																			>
																				{({ selected, active }) => (
																				<>
																					<span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
																						{role.name}
																					</span>

																					{selected ? (
																						<span
																							className={classNames(
																							active ? 'text-white' : 'text-indigo-600',
																							'absolute inset-y-0 right-0 flex items-center pr-4'
																							)}
																						>
																							<CheckIcon className="h-5 w-5" aria-hidden="true" />
																						</span>
																					) : null}
																				</>
																				)}
																			</Listbox.Option>
																		))}
																	</Listbox.Options>
																</Transition>
															</div>
															</>
														)}
													</Listbox>
												</div>
												
												<div className="mt-2">
													<Listbox value={selectedPermission} onChange={setSelectedPermission}>
														{({ open }) => (
															<>
															<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label>
															<div className="relative mt-2">
																<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
																	
																	<span className="block truncate">{selectedPermission?.name}</span>
																	<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
																		<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
																	</span>
																</Listbox.Button>

																<Transition
																	show={open}
																	as={Fragment}
																	leave="transition ease-in duration-100"
																	leaveFrom="opacity-100"
																	leaveTo="opacity-0"
																>
																	<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
																		{allPermission?.map((permission) => (
																			<Listbox.Option
																				key={permission?.id}
																				className={({ active }) =>
																					classNames(
																						active ? 'bg-indigo-600 text-white' : 'text-gray-900',
																						'relative cursor-default select-none py-2 pl-3 pr-9'
																					)
																				}
																				value={permission}
																			>
																				{({ selected, active }) => (
																				<>
																					<span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
																						{permission?.name}
																					</span>

																					{selected ? (
																						<span
																							className={classNames(
																							active ? 'text-white' : 'text-indigo-600',
																							'absolute inset-y-0 right-0 flex items-center pr-4'
																							)}
																						>
																							<CheckIcon className="h-5 w-5" aria-hidden="true" />
																						</span>
																					) : null}
																				</>
																				)}
																			</Listbox.Option>
																		))}
																	</Listbox.Options>
																</Transition>
															</div>
															</>
														)}
													</Listbox>
												</div>
											</div>

											<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
												{!rolePermissionCreateIsLoading && (

													<button
														type="submit"
														className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
														disabled={rolePermissionCreateIsLoading}
													>
														{ 'Add' }
													</button>
												)}
												
												{rolePermissionCreateIsLoading && (

													<button
														type="button"
														className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
														disabled={rolePermissionCreateIsLoading}
													>
														{ 'Please wait...' }
													</button>
												)}

												<button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
													onClick={() => setOpen(false)}
													ref={cancelButtonRef}
												>
													Cancel
												</button>
											</div>
										</form>
									)}
									
									{modalFor === "roleEdit" && (

										<form onSubmit={handleRolePermissionEdit}>
											<div>
												<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
													<AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
												</div>
												<div className="my-6 text-center sm:mt-5">
													<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
														Edit Role/Permission
													</Dialog.Title>
												</div>
												
												<div className="mt-2">
													<div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
														<label htmlFor="name" className="block text-xs font-medium text-gray-900">
															Name
														</label>
														<input
															type="text"
															name="name"
															id="name"
															value={name}
															className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
															// placeholder= {selectedOption === "role" ? "Ex: moderator" : "Ex: add user"}
															onChange={(e) => setName(e.target.value)}
															required
														/>
													</div>
													
													<div className={`mb-4`}>
														{selectedRoleToEdit?.roleHasPermissions?.map((permission,index) => (
															<span className="inline-flex items-center sm:ml-1 rounded-md bg-green-50 px-2 py-1 pl-2 pr-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-900/20">
																{permission?.permission?.name}
																<button
																	className="ml-1 text-red-500 hover:text-red-700"
																	onClick={()=>{
																		handleRolePermissionRevoke(permission?.permission)
																	}}
																>
																	<XCircleIcon className="h-5 w-5" aria-hidden="true" />
																</button>
															</span>
														))}
													</div>
												</div>
											</div>

											<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
												{!roleCreateIsLoading && (

													<button
														type="submit"
														className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
														disabled={roleCreateIsLoading}
													>
														{ 'Update ' }
													</button>
												)}
												
												{roleCreateIsLoading && (

													<button
														type="button"
														className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
														disabled={roleCreateIsLoading}
													>
														{ 'Please wait...' }
													</button>
												)}

												<button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
													onClick={() => setOpen(false)}
													ref={cancelButtonRef}
												>
													Cancel
												</button>
											</div>
										</form>
									)}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</div>
	)
}
