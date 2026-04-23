import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import BoxLoader from '@/utils/BoxLoader';
import { apiRequest } from '@/services/api';

export default function Setting() {
	const [loading, setLoading] = useState(false);
	const [profile, setProfile] = useState(null);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [saving, setSaving] = useState(false);

	const [showDelete, setShowDelete] = useState(false);
	const [delPassword, setDelPassword] = useState('');
	const [delLoading, setDelLoading] = useState(false);
	const [delError, setDelError] = useState('');

	const handleDeleteAccount = async () => {
		if (!profile) return;
		setDelError('');
		if (!delPassword) {
			setDelError('Password is required');
			return;
		}
		setDelLoading(true);
		const res = await apiRequest({ method: 'post', endpoint: '/auth/users/me/delete', data: { password: delPassword }, successMessage: 'Account deleted', useToken: true });
		setDelLoading(false);
		if (res) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		setLoading(true);
		const data = await apiRequest({ method: 'get', endpoint: '/auth/users/me', useToken: true });
		setLoading(false);
		if (data) {
			setProfile(data);
			setName(data.name || '');
			setPhone(data.phone || '');
			setAddress(data.address || '');
		}
	};

	const saveAccount = async (e) => {
		e?.preventDefault();
		if (!profile) return;
		setSaving(true);
		const res = await apiRequest({
			method: 'put',
			endpoint: `/auth/users/${profile.id || profile._id}`,
			data: { name, phone, address },
			successMessage: 'Account updated',
			useToken: true,
		});
		setSaving(false);
		if (res) fetchProfile();
	};

	const sendReset = async () => {
		if (!profile?.email) return;
		await apiRequest({ method: 'post', endpoint: '/auth/users/request-reset', data: { email: profile.email }, successMessage: 'Reset email sent (if account exists)', useToken: false });
	};

	if (loading) return <BoxLoader message="Loading settings..." />;

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Settings</h1>

			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
					</CardHeader>
					<CardContent>
						{!profile ? (
							<p className="text-sm text-muted-foreground">No data</p>
						) : (
							<form onSubmit={saveAccount} className="space-y-4">
								<Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
								<Input placeholder="Email" value={profile.email} disabled />
								<Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
								<Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
								<div className="flex items-center gap-2">
									<Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
									<Button type="button" variant="ghost" onClick={sendReset}>Send password reset email</Button>
								</div>
							</form>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Security</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">Manage your security settings.</p>
						<div className="space-y-3">
							<Button onClick={() => window.location.href = '/dashboard/account/change-password'}>Change password</Button>
							<Button variant="destructive" onClick={() => setShowDelete(true)}>Delete account</Button>
						</div>
					</CardContent>
				</Card>
				<Dialog open={showDelete} onOpenChange={(open) => setShowDelete(open)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete account</DialogTitle>
						</DialogHeader>
						<p className="text-sm text-muted-foreground">This action is irreversible. Enter your password to confirm account deletion.</p>
						<div className="mt-4 grid gap-3">
							<Input type="password" placeholder="Current password" value={delPassword} onChange={(e) => setDelPassword(e.target.value)} />
							{delError && <p className="text-sm text-destructive">{delError}</p>}
						</div>
						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button variant="ghost" disabled={delLoading}>Cancel</Button>
							</DialogClose>
							<Button variant="destructive" onClick={handleDeleteAccount} disabled={delLoading}>{delLoading ? 'Deleting...' : 'Delete account'}</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Notifications</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Notification preferences will be saved per user.</p>
					<div className="mt-4">
						<p className="text-sm">(Add toggles for email / SMS / push here)</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

