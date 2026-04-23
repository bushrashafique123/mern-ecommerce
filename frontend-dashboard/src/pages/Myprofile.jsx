import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BoxLoader from '@/utils/BoxLoader';
import { apiRequest } from '@/services/api';

export default function Myprofile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const data = await apiRequest({ method: 'get', endpoint: '/auth/users/me', useToken: true });
    setLoading(false);
    if (data) {
      setUser(data);
      setName(data.name || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
    }
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!user) return;
    setSaving(true);
    const res = await apiRequest({
      method: 'put',
      endpoint: `/auth/users/${user.id || user._id}`,
      data: { name, phone, address },
      successMessage: 'Profile updated',
      useToken: true,
    });
    setSaving(false);
    if (res) fetchProfile();
  };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    if (!user) return;
    if (!oldPassword || !newPassword || !confirmPassword) return;
    setPwLoading(true);
    const res = await apiRequest({
      method: 'put',
      endpoint: `/auth/users/change-password/${user.id || user._id}`,
      data: { oldPassword, newPassword, confirmPassword },
      successMessage: 'Password changed',
      useToken: true,
    });
    setPwLoading(false);
    if (res) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    await apiRequest({ method: 'post', endpoint: '/auth/users/request-reset', data: { email: user.email }, successMessage: 'Reset email sent (if account exists)', useToken: false });
  };

  if (loading) return <BoxLoader message="Loading profile..." />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            {!user ? (
              <p className="text-sm text-muted-foreground">No profile data.</p>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Email" value={user.email} disabled />
                <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                  <Button type="button" variant="ghost" onClick={handleSendResetEmail}>Send password reset email</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input placeholder="Old password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              <Input placeholder="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input placeholder="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={pwLoading}>{pwLoading ? 'Changing...' : 'Change Password'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
