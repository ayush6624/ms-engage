import React, { useState } from 'react';
import {  Button, Input, useToasts } from '@geist-ui/react';
import { Send } from '@geist-ui/react-icons';
import { useConnectionContext } from '../lib/context/ConnectionContext';

function ChatPanel() {
	const [message, setMessage] = useState('');
	const { user, sendMessage, chats } = useConnectionContext();
	return (
		<div className="right-0 fixed mr-10">
			<div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2 max-h-96">
				{chats.map((chat, idx) => (
					<div
						key={idx}
						className={`rounded py-2 px-3 flex flex-col space-y-1 border-l-2 ${
							chat.email !== user.user.email ?
							'border-red-200':"border-blue-300"
						}`}
					>
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold">
								{chat.email === user.user.email
									? 'You'
									: `${chat.name}`}
							</p>
							<p className="text-sm font-light opacity-80">
								{chat.time}
							</p>
						</div>
						<p className="text-sm">{chat.message}</p>
					</div>
				))}
			</div>
			<form
				onSubmit={(e) => {
					sendMessage(e, message, user.user.email, user.user.name);
					setMessage('');
				}}
				className="flex my-3 space-x-2 items-center"
			>
				<Input
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					size="large"
					placeholder="Enter your message"
				/>

				<Button
					htmlType="submit"
					icon={<Send />}
					auto
					size="medium"
					type="success"
				></Button>
			</form>
		</div>
	);
}

export default ChatPanel;
