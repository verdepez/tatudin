/**
 * Tatudin Voice-to-Text & Speech Recognition Engine
 * Provides live continuous dictation, interim real-time streaming, and intelligent meeting note structuring.
 */

export class SpeechTranscriber {
  constructor() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.recognition = SpeechRec ? new SpeechRec() : null;
    this.isRecording = false;
    this.isPaused = false;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedSeconds = 0;

    this.onResult = null;
    this.onInterim = null;
    this.onStatusChange = null;
    this.onError = null;
    this.onTimerTick = null;

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = 'es-CL';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.isPaused = false;
        this._startTimer();
        this._notifyStatus('recording');
      };

      this.recognition.onresult = (event) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Capitalize sentence beginnings
            const cleanFinal = transcriptChunk.trim();
            if (cleanFinal) {
              const formatted = cleanFinal.charAt(0).toUpperCase() + cleanFinal.slice(1);
              this.finalTranscript = this.finalTranscript 
                ? `${this.finalTranscript.trim()}. ${formatted}`
                : formatted;
              if (this.onResult) {
                this.onResult(this.finalTranscript);
              }
            }
          } else {
            currentInterim += transcriptChunk;
          }
        }
        this.interimTranscript = currentInterim;
        if (this.onInterim) {
          this.onInterim(currentInterim);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('[SpeechRecognition] Error event:', event.error);
        if (event.error === 'no-speech') return; // Ignore silent pauses
        if (this.onError) {
          this.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        // Auto-restart if user did not explicitly stop or pause
        if (this.isRecording && !this.isPaused) {
          try {
            this.recognition.start();
          } catch (e) {
            // Ignore start collisions
          }
        } else {
          this._stopTimer();
          this._notifyStatus(this.isPaused ? 'paused' : 'stopped');
        }
      };
    }
  }

  static isSupported() {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  start({ onResult, onInterim, onStatusChange, onError, onTimerTick, lang = 'es-CL', initialText = '' } = {}) {
    if (!this.recognition) {
      throw new Error('Tu navegador no soporta la Web Speech API nativa. Prueba con Chrome, Edge o Safari.');
    }

    this.onResult = onResult;
    this.onInterim = onInterim;
    this.onStatusChange = onStatusChange;
    this.onError = onError;
    this.onTimerTick = onTimerTick;
    this.finalTranscript = initialText || '';
    this.interimTranscript = '';
    this.recognition.lang = lang;
    this.elapsedSeconds = 0;

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('[SpeechRecognition] Start collision or error:', err);
    }
  }

  pause() {
    if (!this.isRecording || this.isPaused) return;
    this.isPaused = true;
    this._stopTimer();
    try {
      this.recognition.stop();
    } catch (e) {}
    this._notifyStatus('paused');
  }

  resume() {
    if (!this.isRecording || !this.isPaused) return;
    this.isPaused = false;
    this._startTimer();
    try {
      this.recognition.start();
    } catch (e) {}
    this._notifyStatus('recording');
  }

  stop() {
    this.isRecording = false;
    this.isPaused = false;
    this._stopTimer();
    try {
      this.recognition.stop();
    } catch (e) {}
    this._notifyStatus('stopped');
    return {
      finalTranscript: this.finalTranscript.trim(),
      durationSeconds: this.elapsedSeconds
    };
  }

  setText(text) {
    this.finalTranscript = text || '';
  }

  _startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      if (this.onTimerTick) {
        this.onTimerTick(this.elapsedSeconds, this.formatSeconds(this.elapsedSeconds));
      }
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  _notifyStatus(status) {
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  formatSeconds(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Intelligent structuring utility that organizes raw spoken thoughts into clear meeting notes
 */
export function structureMeetingTranscript(rawText = '', kind = 'custom') {
  if (!rawText.trim()) return '';

  const clean = rawText.trim();
  const sentences = clean.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);

  let categoryTitle = 'Diseño & Bocetos';
  if (kind === 'marketing') categoryTitle = 'Marketing & Redes Sociales';
  if (kind === 'meeting') categoryTitle = 'Reunión de Trabajo & Equipo';
  if (kind === 'tattoo') categoryTitle = 'Sesión de Tatuaje / Cuidados';

  // Extract key themes and actions based on sentence keywords
  const agreements = [];
  const nextSteps = [];
  const generalNotes = [];

  sentences.forEach((s) => {
    const lower = s.toLowerCase();
    if (lower.includes('acordamos') || lower.includes('decidimos') || lower.includes('queda en') || lower.includes('aprobado') || lower.includes('definido')) {
      agreements.push(s);
    } else if (lower.includes('hacer') || lower.includes('enviar') || lower.includes('probar') || lower.includes('comprar') || lower.includes('preparar') || lower.includes('para la próxima') || lower.includes('tarea')) {
      nextSteps.push(s);
    } else {
      generalNotes.push(s);
    }
  });

  let structured = `**Minuta de Sesión: ${categoryTitle}**\n\n`;

  if (generalNotes.length > 0) {
    structured += `**Temas Tratados:**\n`;
    generalNotes.forEach(item => {
      structured += `• ${item}.\n`;
    });
    structured += `\n`;
  }

  if (agreements.length > 0) {
    structured += `**Acuerdos & Decisiones:**\n`;
    agreements.forEach(item => {
      structured += `• ${item}.\n`;
    });
    structured += `\n`;
  }

  if (nextSteps.length > 0) {
    structured += `**Próximos Pasos & Acciones:**\n`;
    nextSteps.forEach(item => {
      structured += `• [ ] ${item}.\n`;
    });
    structured += `\n`;
  }

  // If no specific category split was triggered, output organized bullets
  if (agreements.length === 0 && nextSteps.length === 0) {
    structured = `**Minuta de ${categoryTitle}**\n\n**Puntos Clave:**\n` + sentences.map(s => `• ${s}.`).join('\n') + `\n\n**Acuerdos:**\n• (Sin acuerdos explícitos registrados)\n\n**Próximos Pasos:**\n• [ ] Revisar requerimientos.\n`;
  }

  return structured;
}

