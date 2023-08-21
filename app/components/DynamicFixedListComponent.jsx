import {useState} from "react";

const DynamicFixedListComponent = () => {
	const [users, setUsers] = useState([
		{ id: 1, name: 'John Doe' },
		{ id: 2, name: 'Jane Smith' },
		{ id: 3, name: 'David Johnson' },
		{ id: 4, name: 'Sarah Williams' },
		{ id: 5, name: 'Michael Brown' },
		{ id: 6, name: 'Emily Davis' },
		// Add more demo users here if needed
	]);


	const addToTop = () => {
		// Generate new users to be added to the top
		const newUsers = [
			{ id: users.length + 1, name: 'New User 1' },
			{ id: users.length + 2, name: 'New User 2' },
			{ id: users.length + 3, name: 'New User 3' },
			{ id: users.length + 4, name: 'New User 4' },
			{ id: users.length + 5, name: 'New User 5' },
		];

		setUsers([...newUsers, ...users].slice(0, 15));
	};

	const addToBottom = () => {
		// Generate new users to be added to the bottom
		const newUsers = [
			{ id: users.length + 1, name: 'New User 1' },
			{ id: users.length + 2, name: 'New User 2' },
			{ id: users.length + 3, name: 'New User 3' },
			{ id: users.length + 4, name: 'New User 4' },
			{ id: users.length + 5, name: 'New User 5' },
		];

		setUsers([...users, ...newUsers].slice(-15));
	};

	return (
		<div>
			<h1>List of Users</h1>
			<button onClick={addToTop}>Add to Top</button>
			<button onClick={addToBottom}>Add to Bottom</button>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		</div>
	);
};

export default DynamicFixedListComponent