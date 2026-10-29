import { ref, push, set } from 'firebase/database';
import { rtdb } from './firebase';
export const logAdminAction = async (actorId, actorEmail, action, targetId, details) => {
    try {
        const newRef = push(ref(rtdb, 'audit_logs'));
        await set(newRef, { log_id: newRef.key, actor_id: actorId, actor_email: actorEmail, action, target_id: targetId, details, timestamp: Date.now() });
    }
    catch (e) {
        console.error('Audit failed', e);
    }
};
