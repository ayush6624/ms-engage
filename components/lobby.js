const Lobby = ({
	username,
	handleUsernameChange,
	roomName,
	handleRoomNameChange,
	handleSubmit
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<h3>Enter a room</h3>
			<div className={`nes-field`}>
				<label htmlFor="name">Name:</label>
				<input
					className="nes-input"
					type="text"
					id="field"
					value={username}
					onChange={handleUsernameChange}
					required
				/>
			</div>

			<div className={`nes-field`}>
				<label htmlFor="room">Room name:</label>
				<input
					className="nes-input"
					type="text"
					id="room"
					value={roomName}
					onChange={handleRoomNameChange}
					required
				/>
			</div>

			<button type="submit" className="nes-btn is-primary">
				Enter Charades
			</button>
		</form>
	);
};

export default Lobby;
