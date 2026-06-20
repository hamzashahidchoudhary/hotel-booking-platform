import { useState } from "react";
import { useDispatch } from "react-redux";
import { User as UserIcon, Phone } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { updateProfile } from "../store/authSlice.js";
import { showToast } from "../store/uiSlice.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const Account = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(updateProfile(form));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      dispatch(showToast({ message: "Profile updated", type: "success" }));
    } else {
      dispatch(showToast({ message: result.payload, type: "error" }));
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">My account</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-xl font-semibold text-paper">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-lg font-medium text-ink">{user.name}</p>
          <p className="text-sm text-ink/50">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-medium capitalize text-ink/60">
            {user.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="font-display text-base font-medium text-ink">Edit profile</h2>
        <Input
          label="Full name"
          icon={UserIcon}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Phone number"
          icon={Phone}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+1 555 123 4567"
        />
        <Button type="submit" variant="coral" loading={saving}>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default Account;
