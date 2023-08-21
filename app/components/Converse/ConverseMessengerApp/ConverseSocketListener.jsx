import React, { useState, useEffect } from 'react';
import {socket} from "@/socket/socket";
import Dump from "@/components/Dump";
export default function ConverseSocketListener() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [fooEvents, setFooEvents] = useState([]);
	const [fooEvent, setFooEvent] = useState({});

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		function onFooEvent(value) {
			setFooEvents(previous => [...previous, value]);
			setFooEvent(value);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('foo', onFooEvent);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('foo', onFooEvent);
		};
	}, []);

	return (
		<div>
			<Event event={ fooEvent } />
			<ConnectionManager />
			<MyForm />
		</div>
	);
}

function ConnectionState({ isConnected }) {
	return <p>State: { '' + isConnected }</p>;
}

function Events({ events }) {
	return (
		<ul>
			{
				events.map((event, index) =>
					<li key={ index }>{ event }</li>
				)
			}
		</ul>
	);
}

function Event({ event }) {
	return (
		<Dump data={{socketEvent: event}} />
	);
}

function ConnectionManager() {
	function connect() {
		socket.connect();
	}

	function disconnect() {
		socket.disconnect();
	}

	return (
		<>
			<button onClick={ connect }>Connect</button>
			<button onClick={ disconnect }>Disconnect</button>
		</>
	);
}

function MyForm() {
	const [value, setValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);

		const socketMsg = {
			socket: {eventPrivateKey: 'socketTest'},
			data: value
		}
		socket
			.connect()
			.timeout(5000)
			.emit('conversation:updated', socketMsg, () => {
				setIsLoading(false);
			});
	}

	return (
		<form onSubmit={ onSubmit }>
			<input onChange={ e => setValue(e.target.value) } />

			<button type="submit" disabled={ isLoading }>Submit</button>
		</form>
	);
}