package devconnect.model.entity;

import devconnect.model.dto.DeveloperDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Builder @Entity @Table( name = "developer" )
@Data @NoArgsConstructor @AllArgsConstructor
public class DeveloperEntity extends BaseTime{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int dno;

    @Column( length = 30, nullable = false, unique = true )
    private String did;

    @Column( length = 30, nullable = false )
    private String dpwd;

    @Column( length = 30, nullable = false )
    private String dname;

    @Column( length = 13, nullable = false, unique = true )
    private String dphone;

    @Column( length = 255, nullable = false )
    private String daddress;

    @Column( length = 255, nullable = false )
    private String demail;

    @Column( length = 255, nullable = false )
    @ColumnDefault("'default.jpg'")
    private String dprofile;

    @Column( nullable = false )
    @ColumnDefault("1")
    private int dlevel;

    @Column( nullable = false, name = "dcurrentexp" )
    private int dcurrentExp;

    @Column( nullable = false, name = "dtotalexp" )
    private int dtotalExp;

    public DeveloperDto toDto(){
        return DeveloperDto.builder()
                .dno( this.dno )
                .did( this.did )
                .dpwd( this.dpwd )
                .dphone( this.dphone )
                .daddress( this.daddress )
                .demail( this.demail )
                .dprofile( this.dprofile )
                .dlevel( this.dlevel )
                .dcurrentExp( this.dcurrentExp )
                .dtotalExp( this.dtotalExp )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // f end

}
