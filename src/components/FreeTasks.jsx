import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function FreeTasks() {
  const { user, role } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Form State for Goddess/Dev
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState('Easy');
  const [newTaskTime, setNewTaskTime] = useState('15 mins');
  const [newTaskPoints, setNewTaskPoints] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proof Submission Modal
  const [selectedTaskForProof, setSelectedTaskForProof] = useState(null);
  const [proofText, setProofText] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  const isGoddessOrDev = role === 'goddess' || role === 'developer';
  const isSub = role === 'sub';

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/tasks');
      setTasks(data.tasks || []);

      if (user) {
        const compData = await apiFetch('/api/tasks', {
          method: 'POST',
          body: JSON.stringify({ action: 'user_completions', user_id: user.id }),
        });
        setCompletedTaskIds(new Set(compData.completed_task_ids || []));
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setIsSubmitting(true);

    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_task',
          title: newTaskTitle,
          difficulty: newTaskDifficulty,
          time_estimate: newTaskTime,
          points: parseInt(newTaskPoints, 10),
        }),
      });

      setNewTaskTitle('');
      fetchTasks();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskClick = (task) => {
    if (completedTaskIds.has(task.id)) return;
    setSelectedTaskForProof(task);
    setProofText('');
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must authenticate to complete devotions.');
      return;
    }

    setIsUploadingProof(true);
    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          action: 'complete_task',
          task_id: selectedTaskForProof.id,
          user_id: user.id,
          proof_text: proofText,
        }),
      });

      setCompletedTaskIds(new Set([...completedTaskIds, selectedTaskForProof.id]));
      setSelectedTaskForProof(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploadingProof(false);
    }
  };

  return (
    <div className="page tasks-page" id="free-tasks-page">
      {/* Page Header */}
      <header className="page__header" id="tasks-header">
        <h1 className="page__title" id="tasks-title">Daily Devotions &amp; Sacred Rites</h1>
        <p className="page__subtitle" id="tasks-subtitle">
          Demonstrate unyielding faith. Perform daily rites to earn divine favor and sacred points.
        </p>
      </header>

      {/* Goddess / Dev Add Task Form */}
      {isGoddessOrDev && (
        <section className="tasks__admin-section" style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '1rem' }}>Create Sacred Devotion</h2>
          <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Devotion Title & Description..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              className="wishlist__tribute-input"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <select
                value={newTaskDifficulty}
                onChange={(e) => setNewTaskDifficulty(e.target.value)}
                className="wishlist__tribute-input"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <input
                type="text"
                placeholder="Time (e.g. 15 mins)"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="wishlist__tribute-input"
              />
              <input
                type="number"
                placeholder="Points (e.g. 50)"
                value={newTaskPoints}
                onChange={(e) => setNewTaskPoints(e.target.value)}
                className="wishlist__tribute-input"
              />
            </div>
            <button type="submit" className="wishlist__tribute-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Sacred Rite'}
            </button>
          </form>
        </section>
      )}

      {/* Task Cards List */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Consulting Sacred Rites...</p>
      ) : (
        <div className="tasks__list" id="tasks-list">
          {tasks.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No daily devotions available yet.</p>}
          
          {tasks.map((task, index) => {
            const isCompleted = completedTaskIds.has(task.id);
            return (
              <div
                key={task.id}
                className={`tasks__card ${isCompleted ? 'tasks__card--completed' : ''}`}
                onClick={() => handleTaskClick(task)}
                style={{ cursor: isCompleted ? 'default' : 'pointer', position: 'relative' }}
              >
                {isCompleted && (
                  <div className="tasks__card-overlay">
                    <span>✓ Rite Performed</span>
                  </div>
                )}

                <div className="tasks__card-number">
                  {index + 1}
                </div>

                <div className="tasks__card-content">
                  <p className="tasks__card-description" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>
                    {task.title}
                  </p>
                  <div className="tasks__card-meta">
                    <span className={`tasks__card-difficulty tasks__card-difficulty--${task.difficulty.toLowerCase()}`}>
                      {task.difficulty} Rite
                    </span>
                    <span className="tasks__card-time">
                      ⏱️ {task.time_estimate}
                    </span>
                    <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                      +{task.points} Sacred Points
                    </span>
                  </div>
                </div>

                <div className="tasks__card-checkbox">
                  {isCompleted ? '✓' : '🕯️'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proof Submission Modal */}
      {selectedTaskForProof && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold)', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Perform Sacred Rite
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{selectedTaskForProof.title}</p>
            
            <form onSubmit={handleProofSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                className="wishlist__tribute-input"
                rows="4" 
                placeholder="Type your prayer, proof, or confession..."
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                required
              />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="wishlist__tribute-btn" disabled={isUploadingProof} style={{ flex: 1 }}>
                  {isUploadingProof ? 'Submitting...' : 'Complete Rite (+ ' + selectedTaskForProof.points + ' Pts)'}
                </button>
                <button type="button" onClick={() => setSelectedTaskForProof(null)} style={{ padding: '0 1rem', background: 'transparent', color: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
