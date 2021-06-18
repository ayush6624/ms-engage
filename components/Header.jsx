import {
	Row,
	Spacer,
	Text,
	Col,
	ButtonDropdown,
	User,
	Button
} from '@geist-ui/react';
import { useSession, signOut } from 'next-auth/client';
import Link from 'next/link';

export function Header() {
	const [session, loading] = useSession();
	return (
		<Row justify="end" className="mt-3">
			<Col span={5} className="">
				{!session ? (
					<Button>
						<Link href="/login">Login</Link>
					</Button>
				) : (
					<ButtonDropdown>
						<ButtonDropdown.Item main>
							<User
								src={session?.user?.image}
								name={session?.user?.name}
							>
								<User.Link href="#">
									{session?.user?.email.split('@')[0]}
								</User.Link>
							</User>
						</ButtonDropdown.Item>
						<ButtonDropdown.Item onClick={() => signOut()}>
							Logout
						</ButtonDropdown.Item>
					</ButtonDropdown>
				)}
			</Col>
		</Row>
	);
}
