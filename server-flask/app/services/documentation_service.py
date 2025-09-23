from app import db
from app.models.documentation_model import DocumentationEntry, DocumentationFile
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime

class DocumentationService:
    def __init__(self):
        # Obtener la ruta base del proyecto NetControl
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Subir desde services/
        project_root = os.path.dirname(current_dir)  # Subir desde server-flask/ a NetControl/
        self.upload_folder = os.path.join(project_root, "uploads", "documentation")
        
        self.allowed_extensions = {'txt', 'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'}
        self.max_file_size = 16 * 1024 * 1024  # 16MB
        
        # Crear directorio de uploads si no existe
        os.makedirs(self.upload_folder, exist_ok=True)
    
    def allowed_file(self, filename):
        """Verifica si la extensión del archivo es permitida"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def save_file(self, file):
        """Guarda un archivo y retorna la información del mismo"""
        if not file or file.filename == '':
            raise ValueError("No se seleccionó ningún archivo")
        
        if not self.allowed_file(file.filename):
            raise ValueError(f"Tipo de archivo no permitido. Tipos permitidos: {', '.join(self.allowed_extensions)}")
        
        # Generar nombre único
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Ruta completa para guardar el archivo
        abs_file_path = os.path.join(self.upload_folder, unique_filename)
        
        # Verificar tamaño del archivo
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > self.max_file_size:
            raise ValueError(f"El archivo es demasiado grande. Máximo permitido: {self.max_file_size // (1024*1024)}MB")
        
        # Guardar archivo
        file.save(abs_file_path)
        
        return {
            'nombre_original': filename,
            'nombre_archivo': unique_filename,
            'tipo_archivo': filename.rsplit('.', 1)[1].lower(),
            'tamaño': file_size,
            'ruta_archivo': abs_file_path  # Almacenar ruta absoluta en la DB
        }

# Funciones del servicio
def create_documentation_entry(data, files=None):
    """Crea una nueva entrada de documentación"""
    try:
        # Crear la entrada
        entry = DocumentationEntry(
            titulo=data.get("titulo"),
            descripcion=data.get("descripcion"),
            tipo=data.get("tipo"),  # 'historial', 'proximo', 'configuracion'
            categoria=data.get("categoria"),
            dispositivo_afectado=data.get("dispositivo_afectado"),
            fecha_programada=datetime.fromisoformat(data.get("fecha_programada")) if data.get("fecha_programada") else None,
            estado=data.get("estado", "pendiente"),
            prioridad=data.get("prioridad", "media"),
            tecnico_id=data.get("tecnico_id") if data.get("tecnico_id") else None
        )
        
        db.session.add(entry)
        db.session.flush()  # Para obtener el ID
        
        # Procesar archivos si existen
        doc_service = DocumentationService()
        if files:
            for file in files:
                try:
                    file_info = doc_service.save_file(file)
                    
                    # Crear registro del archivo
                    doc_file = DocumentationFile(
                        nombre_original=file_info['nombre_original'],
                        nombre_archivo=file_info['nombre_archivo'],
                        tipo_archivo=file_info['tipo_archivo'],
                        tamaño=file_info['tamaño'],
                        ruta_archivo=file_info['ruta_archivo'],
                        entry_id=entry.id
                    )
                    
                    db.session.add(doc_file)
                
                except Exception as file_error:
                    print(f"Error procesando archivo: {file_error}")
                    # Continuar con otros archivos
        
        db.session.commit()
        return entry.serialize(), 201
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_all_documentation_entries(tipo=None, categoria=None):
    """Obtiene todas las entradas de documentación con filtros opcionales"""
    try:
        query = DocumentationEntry.query
        
        if tipo:
            query = query.filter_by(tipo=tipo)
        if categoria:
            query = query.filter_by(categoria=categoria)
            
        entries = query.order_by(DocumentationEntry.fecha_creacion.desc()).all()
        return [entry.serialize() for entry in entries], 200
        
    except Exception as e:
        return {"error": str(e)}, 500

def get_documentation_entry(entry_id):
    """Obtiene una entrada específica de documentación"""
    try:
        entry = DocumentationEntry.query.get(entry_id)
        if not entry:
            return {"error": "Entrada no encontrada"}, 404
            
        return entry.serialize(), 200
        
    except Exception as e:
        return {"error": str(e)}, 500

def update_documentation_entry(entry_id, data):
    """Actualiza una entrada de documentación"""
    try:
        entry = DocumentationEntry.query.get(entry_id)
        if not entry:
            return {"error": "Entrada no encontrada"}, 404
        
        # Actualizar campos
        if "titulo" in data:
            entry.titulo = data["titulo"]
        if "descripcion" in data:
            entry.descripcion = data["descripcion"]
        if "categoria" in data:
            entry.categoria = data["categoria"]
        if "dispositivo_afectado" in data:
            entry.dispositivo_afectado = data["dispositivo_afectado"]
        if "fecha_programada" in data:
            entry.fecha_programada = datetime.fromisoformat(data["fecha_programada"]) if data["fecha_programada"] else None
        if "estado" in data:
            entry.estado = data["estado"]
        if "prioridad" in data:
            entry.prioridad = data["prioridad"]
        if "tecnico_id" in data:
            entry.tecnico_id = data["tecnico_id"] if data["tecnico_id"] else None
        
        db.session.commit()
        return entry.serialize(), 200
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def update_documentation_entry_with_files(entry_id, data, files=None):
    """Actualiza una entrada de documentación y agrega nuevos archivos si se proporcionan"""
    try:
        entry = DocumentationEntry.query.get(entry_id)
        if not entry:
            return {"error": "Entrada no encontrada"}, 404
        
        # Actualizar campos básicos
        if "titulo" in data:
            entry.titulo = data["titulo"]
        if "descripcion" in data:
            entry.descripcion = data["descripcion"]
        if "categoria" in data:
            entry.categoria = data["categoria"]
        if "dispositivo_afectado" in data:
            entry.dispositivo_afectado = data["dispositivo_afectado"]
        if "fecha_programada" in data:
            entry.fecha_programada = datetime.fromisoformat(data["fecha_programada"]) if data["fecha_programada"] else None
        if "estado" in data:
            entry.estado = data["estado"]
        if "prioridad" in data:
            entry.prioridad = data["prioridad"]
        if "tecnico_id" in data:
            entry.tecnico_id = data["tecnico_id"] if data["tecnico_id"] else None
        
        # Procesar nuevos archivos si se proporcionan
        if files:
            doc_service = DocumentationService()
            for file in files:
                try:
                    file_info = doc_service.save_file(file)
                    
                    # Crear registro del nuevo archivo
                    doc_file = DocumentationFile(
                        nombre_original=file_info['nombre_original'],
                        nombre_archivo=file_info['nombre_archivo'],
                        tipo_archivo=file_info['tipo_archivo'],
                        tamaño=file_info['tamaño'],
                        ruta_archivo=file_info['ruta_archivo'],
                        entry_id=entry.id
                    )
                    
                    db.session.add(doc_file)
                
                except Exception as file_error:
                    print(f"Error procesando archivo: {file_error}")
                    # Continuar con otros archivos
        
        db.session.commit()
        return entry.serialize(), 200
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def delete_documentation_entry(entry_id):
    """Elimina una entrada de documentación y sus archivos asociados"""
    try:
        entry = DocumentationEntry.query.get(entry_id)
        if not entry:
            return {"error": "Entrada no encontrada"}, 404
        
        # Eliminar archivos físicos
        for archivo in entry.archivos:
            archivo.delete_file()
        
        db.session.delete(entry)
        db.session.commit()
        
        return {"message": "Entrada eliminada correctamente"}, 200
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_file(file_id):
    """Obtiene información de un archivo específico"""
    try:
        file = DocumentationFile.query.get(file_id)
        if not file:
            return {"error": "Archivo no encontrado"}, 404
            
        return file.serialize(), 200
        
    except Exception as e:
        return {"error": str(e)}, 500

def delete_file(file_id):
    """Elimina un archivo específico"""
    try:
        file = DocumentationFile.query.get(file_id)
        if not file:
            return {"error": "Archivo no encontrado"}, 404
        
        # Eliminar archivo físico
        file.delete_file()
        
        # Eliminar registro de la base de datos
        db.session.delete(file)
        db.session.commit()
        
        return {"message": "Archivo eliminado correctamente"}, 200
        
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_statistics():
    """Obtiene estadísticas de documentación"""
    try:
        stats = {
            "total_entradas": DocumentationEntry.query.count(),
            "historial": DocumentationEntry.query.filter_by(tipo="historial").count(),
            "proximos": DocumentationEntry.query.filter_by(tipo="proximo").count(),
            "configuraciones": DocumentationEntry.query.filter_by(tipo="configuracion").count(),
            "pendientes": DocumentationEntry.query.filter_by(estado="pendiente").count(),
            "completados": DocumentationEntry.query.filter_by(estado="completado").count(),
            "total_archivos": DocumentationFile.query.count()
        }
        
        return stats, 200
        
    except Exception as e:
        return {"error": str(e)}, 500