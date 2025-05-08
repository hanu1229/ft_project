package devconnect.model.entity;

import devconnect.model.dto.developer.DeveloperDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.ArrayList;
import java.util.List;

@Builder @Entity @Table( name = "developer" )
@Data @NoArgsConstructor @AllArgsConstructor
public class DeveloperEntity extends BaseTime{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int dno;

    @Column( length = 30, nullable = false, unique = true )
    private String did;

    @Column( length = 100, nullable = false )
    private String dpwd;

    @Column( length = 30, nullable = false )
    private String dname;

    @Column( length = 13, nullable = false, unique = true )
    private String dphone;

    @Column( length = 255, nullable = false )
    private String daddress;

    @Column( length = 255, nullable = false )
    private String demail;

    @Column( length = 255 )
    @ColumnDefault("'default.jpg'")
    private String dprofile;

    @Column( nullable = false )
    @ColumnDefault("1")
    private int dlevel;

    @Column( name = "dcurrentexp" )
    @ColumnDefault("0")
    private int dcurrentExp;

    @Column( name = "dtotalexp" )
    @ColumnDefault("0")
    private int dtotalExp;

    @ColumnDefault("1")
    private boolean dstate;

    @OneToMany( mappedBy = "developerEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY )
    @Builder.Default
    @ToString.Exclude
    private List<ProjectJoinEntity> projectJoinEntityList = new ArrayList<>();

    @OneToMany( mappedBy = "developerEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY )
    @Builder.Default
    @ToString.Exclude
    private List<DratingEntity> dratingEntityList = new ArrayList<>();

    @OneToMany( mappedBy = "developerEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY )
    @Builder.Default
    @ToString.Exclude
    private List<CratingEntity> cratingEntityList = new ArrayList<>();

    public DeveloperDto toDto(){
        return DeveloperDto.builder()
                .dno( this.dno )
                .did( this.did )
                .dname( this.dname )
                .dphone( this.dphone )
                .daddress( this.daddress )
                .demail( this.demail )
                .dprofile( this.dprofile )
                .dlevel( this.dlevel )
                .dcurrentExp( this.dcurrentExp )
                .dtotalExp( this.dtotalExp )
                .dstate( this.dstate )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // f end

}
