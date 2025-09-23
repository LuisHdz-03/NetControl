from app import db
from datetime import datetime
import os

class DocumentationEntry(db.Model):
    __tablename__ = "documentation_entries"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # 'historial', 'proximo', 'configuracion'
    categoria = db.Column(db.String(100), nullable=True)  # 'dispositivo', 'red', 'sistema', etc.
    dispositivo_afectado = db.Column(db.String(200), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    fecha_programada = db.Column(db.DateTime, nullable=True)  # Para cambios próximos
    estado = db.Column(db.String(50), default="pendiente")  # 'completado', 'pendiente', 'en_progreso'
    prioridad = db.Column(db.String(20), default="media")  # 'baja', 'media', 'alta', 'critica'
    
    # Relaciones con técnicos
    tecnico_id = db.Column(db.Integer, db.ForeignKey("tecnicos.id"), nullable=True)
    tecnico = db.relationship("Tecnicos", backref="documentation_entries")
    
    # Archivos adjuntos
    archivos = db.relationship("DocumentationFile", back_populates="entry", cascade="all, delete-orphan")
    
    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "tipo": self.tipo,
            "categoria": self.categoria,
            "dispositivo_afectado": self.dispositivo_afectado,
            "fecha_creacion": self.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S"),
            "fecha_programada": self.fecha_programada.strftime("%Y-%m-%d %H:%M:%S") if self.fecha_programada else None,
            "estado": self.estado,
            "prioridad": self.prioridad,
            "tecnico_id": self.tecnico_id,
            "tecnico": self.tecnico.serialize() if self.tecnico else None,
            "archivos": [archivo.serialize() for archivo in self.archivos]
        }

class DocumentationFile(db.Model):
    __tablename__ = "documentation_files"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_original = db.Column(db.String(255), nullable=False)
    nombre_archivo = db.Column(db.String(255), nullable=False)  # Nombre único en el servidor
    tipo_archivo = db.Column(db.String(10), nullable=False)  # 'pdf', 'txt', etc.
    tamaño = db.Column("tamaño", db.Integer, nullable=False)  # Tamaño en bytes - especificar nombre de columna explícitamente
    ruta_archivo = db.Column(db.String(500), nullable=False)
    fecha_subida = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relación con la entrada de documentación
    entry_id = db.Column(db.Integer, db.ForeignKey("documentation_entries.id"), nullable=False)
    entry = db.relationship("DocumentationEntry", back_populates="archivos")
    
    def serialize(self):
        return {
            "id": self.id,
            "nombre_original": self.nombre_original,
            "nombre_archivo": self.nombre_archivo,
            "tipo_archivo": self.tipo_archivo,
            "tamaño": self.tamaño,
            "tamaño_formateado": self.format_file_size(),
            "ruta_archivo": self.ruta_archivo,
            "fecha_subida": self.fecha_subida.strftime("%Y-%m-%d %H:%M:%S"),
            "entry_id": self.entry_id
        }
    
    def format_file_size(self):
        """Convierte bytes a formato legible"""
        size = self.tamaño
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    def delete_file(self):
        """Elimina el archivo físico del servidor"""
        try:
            # La ruta ya es absoluta en la base de datos
            if os.path.exists(self.ruta_archivo):
                os.remove(self.ruta_archivo)
                print(f"Archivo eliminado: {self.ruta_archivo}")
            else:
                print(f"Archivo no encontrado para eliminar: {self.ruta_archivo}")
        except Exception as e:
            print(f"Error eliminando archivo {self.ruta_archivo}: {e}")